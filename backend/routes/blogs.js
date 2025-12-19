import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory recent views cache to avoid counting repeated views
// Keyed by `${blogId}:${userIdOrIp}` with timestamp value (ms since epoch)
const recentViews = new Map();
const VIEW_TTL_MS = parseInt(process.env.VIEW_TTL_MS || String(24 * 60 * 60 * 1000), 10); // default 24 hours
// Multer setup for uploads
// Resolve `uploads` directory relative to this file to avoid issues when cwd differs.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// store blog images under uploads/blogs for clearer organization
let uploadDir = path.join(__dirname, '..', 'uploads', 'blogs');

// Ensure upload directory exists and is writable. If creating/writing under
// the project bundle fails (common in serverless like AWS Lambda where
// /var/task is read-only), fall back to the OS temp directory so uploads
// won't crash the request. Note: temp storage is ephemeral — use S3
// for durable production storage.
const ensureDirWritable = (dir) => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    // check write permission by attempting access
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};

if (!ensureDirWritable(uploadDir)) {
  const fallback = path.join(os.tmpdir(), 'uploads', 'blogs');
  try {
    fs.mkdirSync(fallback, { recursive: true });
    uploadDir = fallback;
    console.warn('Uploads directory not writable; falling back to temp dir:', uploadDir);
  } catch (err) {
    console.error('Failed to create fallback uploads directory', fallback, err);
    // keep original uploadDir (multer will throw when attempting to write)
  }
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-z0-9.\-\_]/gi, '-');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'), false);
  cb(null, true);
};

const maxUploadSize = parseInt(process.env.MAX_UPLOAD_SIZE || String(10 * 1024 * 1024), 10); // default 10MB
const upload = multer({ storage, fileFilter, limits: { fileSize: maxUploadSize } });

const generateSlug = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-');

// Public: list blogs (only published)
router.get('/', async (req, res) => {
  try {
    // Support query params: ?hero=true to return only hero-ranked blogs,
    // and ?limit=N to limit the number of results (default: all)
    // Also ?highlighted=true to get highlighted blogs
    // Hero blogs are sorted by heroRank ascending
    // Highlighted blogs are sorted by views descending
    // Default sorting is by createdAt descending (newest first)
    const { hero, limit, highlighted, mostViewed } = req.query || {};
    const q = { published: true };

    if (hero === 'true' || hero === '1') {
      q.heroRank = { $ne: null };
    }
    if (highlighted === 'true' || highlighted === '1') {
      q.highlighted = true;
    }

    const l = typeof limit !== 'undefined' ? parseInt(limit, 10) || 0 : 0;

    const query = Blog.find(q).populate('category', 'name slug').populate('author', 'name email');

    // Sorting:
    // - hero request: sort by `heroRank` ascending
    // - highlighted request: sort by `views` desc then createdAt
    // - mostViewed request: sort by `views` desc then createdAt (no highlighted filter)
    // - default: newest first
    if (hero === 'true' || hero === '1') {
      query.sort({ heroRank: 1, createdAt: -1 });
    } else if (mostViewed === 'true' || mostViewed === '1') {
      query.sort({ views: -1, createdAt: -1 });
    } else if (highlighted === 'true' || highlighted === '1') {
      query.sort({ views: -1, createdAt: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    if (l > 0) query.limit(l);

    const blogs = await query.exec();
    return res.json(blogs);
  } catch (err) {
    console.error('Failed to list blogs', err);
    return res.status(500).json({ message: 'Failed to load blogs' });
  }
});

// Public: get by id or slug (respect unpublished/private)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const blog = await Blog.findOne(query).populate('category', 'name slug').populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // If not published, only the author may view it
    if (!blog.published) {
      let token = null;
      const rawAuth = (req.headers.authorization || req.headers.Authorization || '').toString();
      if (rawAuth) {
        const parts = rawAuth.split(' ').filter(Boolean);
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) token = parts[1];
        else if (parts.length === 1) token = parts[0];
      }
      if (!token && req.cookies && typeof req.cookies.token === 'string') token = req.cookies.token;

      try {
        if (!token) throw new Error('no token');
        const payload = jwt.verify(token, JWT_SECRET);
        const userId = payload && payload.id ? String(payload.id) : null;
        const authorId = blog.author && blog.author._id ? String(blog.author._id) : String(blog.author);
        if (!userId || userId !== authorId) return res.status(404).json({ message: 'Blog not found' });
      } catch (err) {
        return res.status(404).json({ message: 'Blog not found' });
      }
    }

    return res.json(blog);
  } catch (err) {
    console.error('Failed to get blog', err);
    return res.status(500).json({ message: 'Failed to load blog' });
  }
});

// Public: increment view count for a blog by id or slug
router.post('/:id/view', async (req, res) => {
  try {
    const id = req.params.id;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };

    const blog = await Blog.findOne(query).select('_id');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Identify viewer: prefer authenticated user id, fallback to IP
    let viewerId = null;
    try {
      let token = null;
      const rawAuth = (req.headers.authorization || req.headers.Authorization || '').toString();
      if (rawAuth) {
        const parts = rawAuth.split(' ').filter(Boolean);
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) token = parts[1];
        else if (parts.length === 1) token = parts[0];
      }
      if (!token && req.cookies && typeof req.cookies.token === 'string') token = req.cookies.token;
      if (token) {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload && payload.id) viewerId = String(payload.id);
      }
    } catch (e) {
      // ignore token errors and treat as anonymous
    }

    const ip = (req.headers['x-forwarded-for'] || req.ip || req.connection && req.connection.remoteAddress || '').toString().split(',')[0].trim();
    const identity = viewerId || ip || 'anon';

    const key = `${String(blog._id)}:${identity}`;
    const now = Date.now();
    const last = recentViews.get(key) || 0;
    if (now - last < VIEW_TTL_MS) {
      // Return current views without incrementing
      const current = await Blog.findById(blog._id).select('views');
      return res.json({ views: current ? current.views : 0, counted: false });
    }

    // Atomically increment views
    const updated = await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }, { new: true }).select('views');
    if (!updated) return res.status(404).json({ message: 'Blog not found' });

    recentViews.set(key, now);
    return res.json({ views: updated.views, counted: true });
  } catch (err) {
    console.error('Failed to increment views', err);
    return res.status(500).json({ message: 'Failed to increment views' });
  }
});

// Protected: create blog (accept multipart form with image)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, slug: rawSlug, excerpt, content, category: categoryId, published } = req.body || {};

    // Multer file: req.file
    const file = req.file;

    if (!title || !title.toString().trim()) return res.status(400).json({ message: 'Title is required' });
    if (!content || !content.toString().trim()) return res.status(400).json({ message: 'Content is required' });
    if (!categoryId) return res.status(400).json({ message: 'Category is required' });
    if (!file) return res.status(400).json({ message: 'Image is required' });

    const slug = (rawSlug && String(rawSlug).trim()) || generateSlug(title);

    // check slug unique
    const existing = await Blog.findOne({ slug });
    if (existing) return res.status(409).json({ message: 'Slug already exists' });

    // validate category exists
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: 'Invalid category' });

    // coerce published to boolean (form values may be strings)
    const publishedBool = (published === false || published === 'false' || published === '0' || published === 0) ? false : (published === true || published === 'true' || published === '1' || published === 1) ? true : true;

    const blog = new Blog({
      title: title.trim(),
      slug,
      excerpt: excerpt && String(excerpt).trim(),
      content: content.trim(),
      image: `/uploads/blogs/${file.filename}`,
      author: req.userId || null,
      category: category._id,
      published: publishedBool,
    });

    await blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    console.error('Failed to create blog', err);
    return res.status(500).json({ message: 'Failed to create blog' });
  }
});

// Protected: update an existing blog (accept multipart form with optional image)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    let id = req.params.id;
    if (!id || String(id) === 'undefined') {
      const fallback = (req.body && (req.body.id || req.body._id || req.body.slug)) || null;
      if (fallback) id = fallback; else return res.status(400).json({ message: 'Missing or invalid id parameter' });
    }

    // find by id or slug
    let blog = null;
    if (id.match && id.match(/^[0-9a-fA-F]{24}$/)) blog = await Blog.findById(id);
    if (!blog) blog = await Blog.findOne({ slug: id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const authorId = blog.author ? String(blog.author) : null;
    const userId = req.userId || null;
    if (!userId || String(authorId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    const { title, slug: rawSlug, excerpt, content, category: categoryId, published } = req.body || {};

    // update fields when provided
    if (title && String(title).trim()) blog.title = String(title).trim();
    if (rawSlug && String(rawSlug).trim()) blog.slug = String(rawSlug).trim();
    if (typeof excerpt !== 'undefined') blog.excerpt = excerpt && String(excerpt).trim();
    if (typeof content !== 'undefined' && String(content).trim()) blog.content = String(content).trim();
    if (typeof categoryId !== 'undefined' && categoryId) blog.category = categoryId;
    if (typeof published !== 'undefined') blog.published = (published === true || published === 'true' || published === '1' || published === 1) ? true : false;

    // handle optional new image
    const file = req.file;
    if (file) {
      // remove old file if present
      try {
        if (blog.image && typeof blog.image === 'string') {
          const imagePath = blog.image.replace(/^\/+/, '');
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const oldPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.warn('Failed to remove old blog image', err);
      }
      blog.image = `/uploads/blogs/${file.filename}`;
    }

    await blog.save();
    const updated = await Blog.findById(blog._id).populate('category', 'name slug').populate('author', 'name email');
    return res.json(updated);
  } catch (err) {
    console.error('Failed to update blog', err);
    return res.status(500).json({ message: 'Failed to update blog' });
  }
});

export default router;
