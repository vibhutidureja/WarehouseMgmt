import express from 'express';
import Shipping from '../models/Shipping.js';
import Order from '../models/Order.js';
import LogisticsCompany from '../models/LogisticsCompany.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const shipments = await Shipping.findAll({
    include: [Order, LogisticsCompany]
  });
  res.json(shipments);
});

router.post('/', async (req, res) => {
  try {
    const shipping = await Shipping.create(req.body);
    res.status(201).json(shipping);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
