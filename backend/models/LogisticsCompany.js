import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const LogisticsCompany = sequelize.define('LogisticsCompany', {
  logistics_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  company_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  phone_no: { type: DataTypes.STRING(15) }
}, {
  tableName: 'Logistics_Company',
  timestamps: false
});

export default LogisticsCompany;
