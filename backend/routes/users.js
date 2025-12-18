import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/v1/users
// Returns a paginated list of users (excludes password)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 100));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, 'name email bio createdAt').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    return res.json({ users, total, page, limit });
  } catch (err) {
    console.error('Failed to load users', err);
    return res.status(500).json({ message: 'Failed to load users' });
  }
});

export default router;
