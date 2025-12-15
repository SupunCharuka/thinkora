import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Blog from '../models/Blog.js';

const router = express.Router();

// Return blogs for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.userId || null;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const blogs = await Blog.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .populate('author', 'name email');

    return res.json(blogs);
  } catch (err) {
    console.error('Failed to load user blogs', err);
    return res.status(500).json({ message: 'Failed to load user blogs' });
  }
});

// Toggle publish state for a user's blog
router.patch('/:id/publish', async (req, res) => {
  try {
    const userId = req.userId || null;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let id = req.params.id;
    const { published } = req.body || {};

    // If id param is missing or the literal 'undefined', try to fall back to id/_id/slug from body
    if (!id || String(id) === 'undefined') {
      const fallback = (req.body && (req.body.id || req.body._id || req.body.slug)) || null;
      if (fallback) {
        console.warn('Using fallback id from request body:', fallback);
        id = fallback;
      } else {
        return res.status(400).json({ message: 'Missing or invalid id parameter' });
      }
    }

    if (typeof published === 'undefined') return res.status(400).json({ message: 'Missing published value' });

    // Try by ObjectId first; if not found, try slug
    let blog = await Blog.findById(id);
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    const authorId = blog.author ? String(blog.author) : null;
    if (!authorId || String(authorId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    blog.published = !!published;
    await blog.save();

    const updated = await Blog.findById(blog._id).populate('category', 'name slug').populate('author', 'name email');
    return res.json(updated);
  } catch (err) {
    console.error('Failed to toggle publish', err);
    return res.status(500).json({ message: 'Failed to update blog', error: err.message });
  }
});

// Set or clear hero rank for a user's blog (heroRank: 1..4 or null to clear)
router.patch('/:id/hero', async (req, res) => {
  try {
    const userId = req.userId || null;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let id = req.params.id;
    const { heroRank } = req.body || {};

    if (!id || String(id) === 'undefined') {
      const fallback = (req.body && (req.body.id || req.body._id || req.body.slug)) || null;
      if (fallback) id = fallback; else return res.status(400).json({ message: 'Missing or invalid id parameter' });
    }

    // validate heroRank
    if (typeof heroRank === 'undefined') return res.status(400).json({ message: 'Missing heroRank' });
    const rank = heroRank === null || heroRank === '' ? null : Number(heroRank);
    if (rank !== null && (!Number.isInteger(rank) || rank < 1 || rank > 4)) return res.status(400).json({ message: 'heroRank must be 1..4 or null' });

    // find blog
    let blog = null;
    if (id.match && id.match(/^[0-9a-fA-F]{24}$/)) blog = await Blog.findById(id);
    if (!blog) blog = await Blog.findOne({ slug: id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const authorId = blog.author ? String(blog.author) : null;
    if (!authorId || String(authorId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    // If assigning a rank, clear any other blog of this user that has same rank
    if (rank !== null) {
      await Blog.updateMany({ author: userId, heroRank: rank }, { $set: { heroRank: null } });
      blog.heroRank = rank;
    } else {
      blog.heroRank = null;
    }

    await blog.save();
    const updated = await Blog.findById(blog._id).populate('category', 'name slug').populate('author', 'name email');
    return res.json(updated);
  } catch (err) {
    console.error('Failed to update hero rank', err);
    return res.status(500).json({ message: 'Failed to update hero rank', error: err.message });
  }
});

export default router;

// Delete a user's blog and remove uploaded image file
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.userId || null;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let id = req.params.id;
    if (!id || String(id) === 'undefined') {
      const fallback = (req.body && (req.body.id || req.body._id || req.body.slug)) || null;
      if (fallback) {
        id = fallback;
      } else {
        return res.status(400).json({ message: 'Missing or invalid id parameter' });
      }
    }

    // find by id or slug
    let blog = await Blog.findById(id);
    if (!blog) blog = await Blog.findOne({ slug: id });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const authorId = blog.author ? String(blog.author) : null;
    if (!authorId || String(authorId) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });

    // attempt to remove image file if present and located under uploads
    try {
      if (blog.image && typeof blog.image === 'string') {
        // normalize image path like '/uploads/filename'
        const imagePath = blog.image.replace(/^\/+/, '');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadsPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(uploadsPath)) {
          fs.unlinkSync(uploadsPath);
        }
      }
    } catch (err) {
      console.warn('Failed to remove blog image file', err);
    }

    await Blog.deleteOne({ _id: blog._id });
    return res.json({ message: 'Deleted', id: blog._id });
  } catch (err) {
    console.error('Failed to delete blog', err);
    return res.status(500).json({ message: 'Failed to delete blog', error: err.message });
  }
});
