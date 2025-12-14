import express from 'express';
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

export default router;
