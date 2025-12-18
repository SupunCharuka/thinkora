import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// POST /api/v1/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });

    const contact = new Contact({ name: String(name).trim(), email: String(email).trim(), message: String(message).trim() });
    await contact.save();

    // Could add email notification here (nodemailer) or enqueue job
    return res.status(201).json({ message: 'Message received' });
  } catch (err) {
    console.error('Failed to save contact message', err);
    return res.status(500).json({ message: 'Failed to submit message' });
  }
});

export default router;
