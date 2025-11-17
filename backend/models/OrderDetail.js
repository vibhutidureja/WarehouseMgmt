import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const OrderDetail = sequelize.define('OrderDetail', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  p_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Order_Details',
  timestamps: false
});

export default OrderDetail;