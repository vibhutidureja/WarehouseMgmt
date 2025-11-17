import express from 'express';
import LogisticsCompany from '../models/LogisticsCompany.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const companies = await LogisticsCompany.findAll();
  res.json(companies);
});

router.post('/', async (req, res) => {
  try {
    const company = await LogisticsCompany.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
