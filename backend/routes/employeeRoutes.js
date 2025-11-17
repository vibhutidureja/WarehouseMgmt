import express from 'express';
import Employee from '../models/Employee.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const employees = await Employee.findAll();
  res.json(employees);
});

router.get('/:ssn', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.ssn);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;