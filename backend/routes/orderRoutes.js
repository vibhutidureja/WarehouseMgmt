import express from 'express';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Shipping from '../models/Shipping.js';
import OrderDetail from '../models/OrderDetail.js';
import Payment from '../models/Payment.js';
import { sequelize } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const orders = await Order.findAll({
    include: [
      Customer,
      {
        model: OrderDetail,
        include: [Product]
      },
      Shipping
    ]
  });
  res.json(orders);
});

router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customer_id, order_date, orderDetails, payment } = req.body;

    // Create the order
    const order = await Order.create({
      customer_id,
      order_date
    }, { transaction });

    // Create order details
    const orderDetailPromises = orderDetails.map(detail => {
      return OrderDetail.create({
        order_id: order.order_id,
        p_id: detail.p_id,
        quantity: detail.quantity,
        amount: detail.amount
      }, { transaction });
    });

    await Promise.all(orderDetailPromises);

    // Create payment if provided
    let createdPayment = null;
    if (payment) {
      createdPayment = await Payment.create({
        order_id: order.order_id,
        method: payment.method,
        amount: payment.amount,
        status: payment.status || 'UNPAID'
      }, { transaction });
    }

    await transaction.commit();

    // Fetch the complete order with details
    const completeOrder = await Order.findByPk(order.order_id, {
      include: [
        Customer,
        {
          model: OrderDetail,
          include: [Product]
        },
        Payment
      ]
    });

    res.status(201).json({
      order: completeOrder,
      payment: createdPayment
    });
  } catch (err) {
    await transaction.rollback();
    res.status(400).json({ error: err.message });
  }
});

export default router;
