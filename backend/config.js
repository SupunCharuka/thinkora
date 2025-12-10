import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT);

export const mongoDBURL = process.env.MONGODB_URL;

export const FRONTEND_URL = process.env.FRONTEND_URL;