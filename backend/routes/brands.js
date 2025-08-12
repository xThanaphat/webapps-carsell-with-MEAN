import { Router } from 'express';
import Brand from '../models/Brand.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (e) { next(e); }
});

export default router;
