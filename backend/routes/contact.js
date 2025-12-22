import express from 'express';
import Contact from '../models/Contact.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public: submit contact message
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

// Protected: list contact messages (for dashboard)
// GET /api/v1/contact
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (err) {
    console.error('Failed to list contact messages', err);
    return res.status(500).json({ message: 'Failed to load messages' });
  }
});

// Protected: delete a contact message
// DELETE /api/v1/contact/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Missing id' });
    const c = await Contact.findById(id);
    if (!c) return res.status(404).json({ message: 'Message not found' });
    await Contact.deleteOne({ _id: c._id });
    return res.json({ message: 'Deleted', id: c._id });
  } catch (err) {
    console.error('Failed to delete contact message', err);
    return res.status(500).json({ message: 'Failed to delete message' });
  }
});

export default router;
