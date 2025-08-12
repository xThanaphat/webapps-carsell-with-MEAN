import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import brandsRouter from './routes/brands.js';
import carsRouter from './routes/cars.js';
import contactRouter from './routes/contact.js';
import mockRouter from './routes/mock.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/premium_cars';
const PORT = process.env.PORT || 4000;
const USE_MOCK = String(process.env.USE_MOCK || '').toLowerCase() === '1' || String(process.env.USE_MOCK || '').toLowerCase() === 'true';

if (!USE_MOCK) {
  mongoose.connect(MONGODB_URI).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
} else {
  console.log('Starting API in MOCK mode (no database connection).');
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

if (USE_MOCK) {
  // Serve routes backed by local JSON data
  app.use('/api', mockRouter);
} else {
  app.use('/api/brands', brandsRouter);
  app.use('/api/cars', carsRouter);
  app.use('/api/contact', contactRouter);
}

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}${USE_MOCK ? ' (mock mode)' : ''}`);
});
