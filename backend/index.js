import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, mongoDBURL, FRONTEND_URL } from './config.js';


const app = express();

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

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