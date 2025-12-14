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

export default router;
