import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// Protected dashboard route - returns simple per-user counts for the dashboard
router.get('/', async (req, res) => {
  try {
    const userId = req.userId || null;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Count total blogs for this user
    const totalBlogs = await Blog.countDocuments({ author: userId });
    const published = await Blog.countDocuments({ author: userId, published: true });
    const priv = await Blog.countDocuments({ author: userId, published: false });

    return res.json({
      message: 'Dashboard data',
      userId,
      totalBlogs,
      published,
      private: priv,
    });
  } catch (err) {
    console.error('Dashboard route error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
