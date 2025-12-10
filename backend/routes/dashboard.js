import express from 'express';

const router = express.Router();

// Example protected dashboard route. The auth middleware (applied in index.js)
// will verify the token and set `req.userId`.
router.get('/', (req, res) => {
  return res.json({ message: 'Dashboard data', userId: req.userId || null });
});

export default router;
