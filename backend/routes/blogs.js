import express from 'express';
import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const generateSlug = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-');

// Public: list blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate('category', 'name slug').populate('author', 'name email');
    return res.json(blogs);
  } catch (err) {
    console.error('Failed to list blogs', err);
    return res.status(500).json({ message: 'Failed to load blogs' });
  }
});

// Public: get by id or slug
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const blog = await Blog.findOne(query).populate('category', 'name slug').populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    return res.json(blog);
  } catch (err) {
    console.error('Failed to get blog', err);
    return res.status(500).json({ message: 'Failed to load blog' });
  }
});

// Protected: create blog
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, slug: rawSlug, excerpt, content, category: categoryId, published } = req.body || {};

    if (!title || !title.toString().trim()) return res.status(400).json({ message: 'Title is required' });
    if (!content || !content.toString().trim()) return res.status(400).json({ message: 'Content is required' });

    const slug = (rawSlug && String(rawSlug).trim()) || generateSlug(title);

    // check slug unique
    const existing = await Blog.findOne({ slug });
    if (existing) return res.status(409).json({ message: 'Slug already exists' });

    // optional: validate category exists
    let category = null;
    if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) return res.status(400).json({ message: 'Invalid category' });
    }

    const blog = new Blog({
      title: title.trim(),
      slug,
      excerpt: excerpt && String(excerpt).trim(),
      content: content.trim(),
      author: req.userId || null,
      category: category ? category._id : null,
      published: typeof published === 'boolean' ? published : true,
    });

    await blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    console.error('Failed to create blog', err);
    return res.status(500).json({ message: 'Failed to create blog' });
  }
});

export default router;
