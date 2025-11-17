import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Supplier = sequelize.define('Supplier', {
  supplier_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  contact: { type: DataTypes.STRING(15) },
  email: { type: DataTypes.STRING(100) }
}, {
  tableName: 'Supplier'
});

export default Supplier;
