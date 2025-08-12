import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Brand from '../models/Brand.js';
import Car from '../models/Car.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/premium_cars';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  const brands = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/brands.json'), 'utf-8'));
  const cars = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf-8'));

  await Car.deleteMany({});
  await Brand.deleteMany({});

  const brandMap = {};
  for (const b of brands) {
    const doc = await Brand.create(b);
    brandMap[b.slug] = doc._id;
  }

  for (const c of cars) {
    const brandId = brandMap[c.brand];
    if (!brandId) continue;
    await Car.create({ ...c, brand: brandId });
  }

  console.log('Seed completed');
  await mongoose.disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
