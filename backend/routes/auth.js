import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../config.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hash });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update profile (protected)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, bio } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    // Check if email is used by another user
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    user.email = email;
    if (typeof bio !== 'undefined') user.bio = bio;
    await user.save();

    return res.json({ user: { id: user._id, name: user.name, email: user.email, bio: user.bio } });
  } catch (err) {
    console.error('Profile update error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile (protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('name email bio');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user: { id: user._id, name: user.name, email: user.email, bio: user.bio } });
  } catch (err) {
    console.error('Profile fetch error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
