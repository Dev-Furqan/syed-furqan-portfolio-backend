import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import contactRoutes from './src/routes/contact.routes.js';
import { notFound, errorHandler } from './src/middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = '2026-05-14-railway-cors-db-v2';
const DEFAULT_CLIENT_URLS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://syed-furqan-portfolio.vercel.app',
];
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...DEFAULT_CLIENT_URLS, ...clientUrls]);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    const isHttps = protocol === 'https:';
    const isVercelPreview = hostname.endsWith('.vercel.app') && hostname.includes('syed-furqan-portfolio');
    return isHttps && isVercelPreview;
  } catch {
    return false;
  }
}

app.use(
  (req, res, next) => {
    const origin = req.headers.origin;

    if (isAllowedOrigin(origin)) {
      if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  },
);

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'portfolio-api',
    version: API_VERSION,
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'portfolio-api',
    version: API_VERSION,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'not_connected',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/contact', contactRoutes);
app.use(notFound);
app.use(errorHandler);

async function connectDatabase() {
  try {
    await connectDB(process.env.MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('API is running, but contact form storage needs MONGODB_URI/Atlas access fixed.');
  }
}

app.listen(PORT, () => {
  console.log(`Portfolio API running on port ${PORT}`);
  connectDatabase();
});
