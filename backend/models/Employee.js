import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Employee = sequelize.define('Employee', {
  ssn: {
    type: DataTypes.CHAR(9),
    primaryKey: true,
    allowNull: false
  },
  name: { type: DataTypes.STRING(100), allowNull: false },
  DOB: {
    type: DataTypes.DATE,
    allowNull: false
  },
  salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  mgr_ssn: {
    type: DataTypes.CHAR(9)
  },
  phone: {
    type: DataTypes.CHAR(10)
  },
  email: {
    type: DataTypes.STRING(100)
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Employee',
  timestamps: false
});

export default Employee;