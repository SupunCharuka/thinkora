import express from 'express';
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

// Public: list categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    console.error('Failed to list categories', err);
    return res.status(500).json({ message: 'Failed to load categories' });
  }
});

// Protected: create category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, slug: rawSlug, description } = req.body || {};

    if (!name || !name.toString().trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const slug = (rawSlug && String(rawSlug).trim()) || generateSlug(name);

    // Check uniqueness
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return res.status(409).json({ message: 'Category name or slug already exists' });
    }

    const cat = new Category({ name: name.trim(), slug, description });
    await cat.save();
    return res.status(201).json(cat);
  } catch (err) {
    console.error('Failed to create category', err);
    return res.status(500).json({ message: 'Failed to create category' });
  }
});

export default router;
