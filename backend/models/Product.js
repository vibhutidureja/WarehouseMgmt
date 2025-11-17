import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Product = sequelize.define('Product', {
  p_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  p_name: { type: DataTypes.STRING(100), allowNull: false },
  category: { type: DataTypes.STRING(50) },
  unit_price: { type: DataTypes.DECIMAL(10, 2) },
  selling_price: { type: DataTypes.DECIMAL(10, 2) },
  weight: { type: DataTypes.DECIMAL(10, 2) },
  stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 }, // New field
  supplier_id: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'Product',
  timestamps: false
});

export default Product;
