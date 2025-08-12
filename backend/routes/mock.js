import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

function readJson(filename) {
  const p = path.join(process.cwd(), 'data', filename);
  const raw = fs.readFileSync(p, 'utf-8');
  return JSON.parse(raw);
}

const brands = readJson('brands.json');
const carsRaw = readJson('cars.json');

// Build brand lookup and enrich cars
const brandBySlug = new Map(brands.map(b => [b.slug, b]));
const cars = carsRaw.map((c, idx) => {
  const brand = brandBySlug.get(c.brand);
  return {
    _id: String(idx + 1),
    ...c,
    brand: brand ? { ...brand, _id: brand.slug } : null,
    createdAt: new Date().toISOString()
  };
});

router.get('/health', (req, res) => res.json({ ok: true, mock: true }));

router.get('/brands', (req, res) => {
  res.json(brands.map(b => ({ ...b, _id: b.slug })));
});

router.get('/cars', (req, res) => {
  let result = [...cars];
  const { brand, q, minPrice, maxPrice, sort = 'new' } = req.query;
  if (brand) {
    result = result.filter(c => c.brand && c.brand.slug === brand);
  }
  if (q) {
    const rx = new RegExp(String(q), 'i');
    result = result.filter(c => rx.test(c.title));
  }
  if (minPrice || maxPrice) {
    result = result.filter(c => {
      const okMin = minPrice ? c.price >= Number(minPrice) : true;
      const okMax = maxPrice ? c.price <= Number(maxPrice) : true;
      return okMin && okMax;
    });
  }
  const sortMap = {
    'new': (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'year-desc': (a, b) => (b.year || 0) - (a.year || 0),
    'year-asc': (a, b) => (a.year || 0) - (b.year || 0)
  };
  result.sort(sortMap[sort] || sortMap['new']);
  res.json(result.slice(0, 100));
});

router.get('/cars/:id', (req, res) => {
  const car = cars.find(c => c._id === req.params.id);
  if (!car) return res.status(404).json({ message: 'Not found' });
  res.json(car);
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  // In mock mode, just echo success
  return res.status(201).json({ ok: true });
});

export default router;
