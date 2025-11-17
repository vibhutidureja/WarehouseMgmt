import express from 'express';
import Supplier from '../models/Supplier.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const suppliers = await Supplier.findAll({ order: [['supplier_id', 'ASC']] });
  res.json(suppliers);
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
