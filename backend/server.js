import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, sequelize } from './config/db.js';
import './models/associations.js';

import orderRoutes from './routes/orderRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Warehouse Management API running' });
});

app.use('/api/orders', orderRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

initDB().then(async () => {
  // Skip sync since tables are already created with proper schema
  console.log('Connected to warehouse database with existing schema');
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start server due to DB init error:', err);
  process.exit(1);
});
