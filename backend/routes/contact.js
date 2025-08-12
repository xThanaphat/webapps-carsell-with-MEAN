import { Router } from 'express';
import Message from '../models/Message.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const doc = await Message.create({ name, email, phone, message });
    res.status(201).json({ ok: true, id: doc._id });
  } catch (e) { next(e); }
});

export default router;
