import { Sequelize } from 'sequelize';

const dbName = process.env.MYSQL_DB || 'warehouse';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPass = process.env.MYSQL_PASSWORD || 'yash';
const dbHost = process.env.MYSQL_HOST || '127.0.0.1';
const dbPort = process.env.MYSQL_PORT || 3306;

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: false,
    freezeTableName: false
  }
});

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established');
  } catch (err) {
    console.error('DB authentication error:', err);
    throw err;
  }
};
