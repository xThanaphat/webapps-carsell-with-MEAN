import { Router } from 'express';
import Car from '../models/Car.js';
import Brand from '../models/Brand.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { brand, q, minPrice, maxPrice, sort = 'new' } = req.query;
    const filter = {};
    if (brand) {
      const b = await Brand.findOne({ slug: brand });
      if (b) filter.brand = b._id; else filter.brand = null;
    }
    if (q) {
      filter.title = { $regex: q, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      'new': { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'year-desc': { year: -1 },
      'year-asc': { year: 1 }
    };

    const cars = await Car.find(filter).populate('brand').sort(sortMap[sort] || sortMap['new']).limit(100);
    res.json(cars);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate('brand');
    if (!car) return res.status(404).json({ message: 'Not found' });
    res.json(car);
  } catch (e) { next(e); }
});

export default router;
