import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Customer = sequelize.define('Customer', {
  customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  address: { type: DataTypes.TEXT },
  phone_no: { type: DataTypes.STRING(15) },
  email_id: { type: DataTypes.STRING(100) }
}, {
  tableName: 'Customer',
  timestamps: false
});

export default Customer;