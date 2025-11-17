import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'order_id'
    }
  },
  method: {
    type: DataTypes.ENUM('CC', 'DC', 'UPI'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PAID', 'UNPAID'),
    allowNull: false,
    defaultValue: 'UNPAID'
  }
}, {
  tableName: 'Payment',
  timestamps: false
});

export default Payment;