import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { JWT_SECRET } from '../config.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Register
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ message: 'Email already in use' });

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const user = new User({ name, email, password: hash });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

//     return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.error('Register error', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // create a session id and include in token so sessions can be tracked/revoked
    const sid = crypto.randomBytes(16).toString('hex');
    const token = jwt.sign({ id: user._id, sid }, JWT_SECRET, { expiresIn: '7d' });

    // record session (best-effort)
    try {
      const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip || '';
      const userAgent = req.get('User-Agent') || '';
      await Session.create({ user: user._id, sid, ip, userAgent });
    } catch (e) {
      console.error('Failed to create session record', e);
    }

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

    const { name, email, bio, currentPasswordForEmail } = req.body || {};
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const emailChanged = (typeof email === 'string' && email !== user.email);
    if (emailChanged) {
      if (!currentPasswordForEmail) return res.status(401).json({ message: 'Current password is required to change email' });
      const match = await bcrypt.compare(currentPasswordForEmail, user.password);
      if (!match) return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Check if email is used by another user
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

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

// Change password (protected)
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new password are required' });
    if (typeof newPassword !== 'string' || newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    // Prevent reusing the same password
    const same = await bcrypt.compare(newPassword, user.password);
    if (same) return res.status(400).json({ message: 'New password must be different from the current password' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Change password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// List sessions (devices) for current user
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const sessions = await Session.find({ user: userId }).select('sid ip userAgent createdAt lastSeen').sort({ lastSeen: -1 });
    return res.json({ sessions });
  } catch (err) {
    console.error('Sessions fetch error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Revoke a session (logout a device)
router.delete('/sessions/:sid', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user.id);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { sid } = req.params || {};
    if (!sid) return res.status(400).json({ message: 'Session id required' });

    const deleted = await Session.findOneAndDelete({ sid, user: userId });
    if (!deleted) return res.status(404).json({ message: 'Session not found' });
    return res.json({ message: 'Session revoked' });
  } catch (err) {
    console.error('Session revoke error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;

