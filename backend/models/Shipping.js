import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Shipping = sequelize.define('Shipping', {
  tracking_id: { type: DataTypes.INTEGER, allowNull: false },
  order_id: { type: DataTypes.INTEGER, primaryKey: true },
  logistics_id: { type: DataTypes.INTEGER, primaryKey: true },
  status: {
    type: DataTypes.ENUM('NOT DISPATCHED', 'DISPATCHED', 'DELIVERED'),
    defaultValue: 'NOT DISPATCHED'
  }
}, {
  tableName: 'Shipping',
  timestamps: false
});

export default Shipping;
