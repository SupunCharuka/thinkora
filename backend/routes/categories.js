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

// Protected: update category
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, slug: rawSlug, description } = req.body || {};

    if (!name || !name.toString().trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const slug = (rawSlug && String(rawSlug).trim()) || generateSlug(name);

    // Check uniqueness excluding current
    const existing = await Category.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    });
    if (existing) {
      return res.status(409).json({ message: 'Category name or slug already exists' });
    }

    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    cat.name = name.trim();
    cat.slug = slug;
    cat.description = description;
    await cat.save();

    return res.json(cat);
  } catch (err) {
    console.error('Failed to update category', err);
    return res.status(500).json({ message: 'Failed to update category' });
  }
});

export default router;
