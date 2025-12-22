import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { PORT, mongoDBURL, FRONTEND_URL } from './config.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import dashboardRoutes from './routes/dashboard.js';
import dashboardBlogsRoutes from './routes/dashboardBlogs.js';
import categoriesRoutes from './routes/categories.js';
import blogsRoutes from './routes/blogs.js';
import usersRoutes from './routes/users.js';
import authMiddleware from './middleware/auth.js';


const app = express();

// Increase default request body limits to allow larger JSON/form payloads
// Default express.json limit is ~100kb; raise to 10MB (adjust via env if needed)
const DEFAULT_BODY_LIMIT = process.env.EXPRESS_BODY_LIMIT || '10mb';
app.use(express.json({ limit: DEFAULT_BODY_LIMIT }));
app.use(express.urlencoded({ limit: DEFAULT_BODY_LIMIT, extended: true }));

// Serve uploaded files from /uploads. Use a writable directory fallback (os.tmpdir())
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let uploadsRoot = path.join(__dirname, 'uploads');
try {
  fs.accessSync(uploadsRoot, fs.constants.W_OK);
} catch (err) {
  uploadsRoot = path.join(os.tmpdir(), 'uploads');
  try {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  } catch (e) {
    console.error('Failed to create fallback uploads directory', uploadsRoot, e);
  }
}
app.use('/uploads', express.static(uploadsRoot));

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// Auth routes (versioned)
app.use('/api/v1/auth', authRoutes);
// Contact endpoint (public)
app.use('/api/v1/contact', contactRoutes);

// Dashboard (protected)
app.use('/api/v1/dashboard', authMiddleware, dashboardRoutes);
// Dashboard: user's blogs (protected)
app.use('/api/v1/dashboard/blogs', authMiddleware, dashboardBlogsRoutes);

// Users: protected - return list of users (for admin/dashboard)
app.use('/api/v1/users', authMiddleware, usersRoutes);

// Categories: public list, protected create handled inside router
app.use('/api/v1/categories', categoriesRoutes);

// Blogs: public list + protected create
app.use('/api/v1/blogs', blogsRoutes);

// Start server after connecting to MongoDB
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  }); 