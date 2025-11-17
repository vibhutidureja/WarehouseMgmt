import Order from './Order.js';
import Shipping from './Shipping.js';
import Product from './Product.js';
import Supplier from './Supplier.js';
import LogisticsCompany from './LogisticsCompany.js';
import Customer from './Customer.js';
import Employee from './Employee.js';
import OrderDetail from './OrderDetail.js';
import Payment from './Payment.js';

// Customer - Order
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

// Order - OrderDetail (1:many)
Order.hasMany(OrderDetail, { foreignKey: 'order_id' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });

// Product - OrderDetail
Product.hasMany(OrderDetail, { foreignKey: 'p_id', sourceKey: 'p_id' });
OrderDetail.belongsTo(Product, { foreignKey: 'p_id', targetKey: 'p_id' });

// Order - Shipping (1:1)
Order.hasOne(Shipping, { foreignKey: 'order_id' });
Shipping.belongsTo(Order, { foreignKey: 'order_id' });

// LogisticsCompany - Shipping
LogisticsCompany.hasMany(Shipping, { foreignKey: 'logistics_id' });
Shipping.belongsTo(LogisticsCompany, { foreignKey: 'logistics_id' });

// Order - Payment (1:1)
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

export { Order, Shipping, Product, Supplier, LogisticsCompany, Customer, Employee, OrderDetail, Payment };