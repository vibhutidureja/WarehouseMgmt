import React, { useState } from 'react';
import SupplierForm from './components/SupplierForm.jsx';
import ProductForm from './components/ProductForm.jsx';
import LogisticsForm from './components/LogisticsForm.jsx';
import OrderForm from './components/OrderForm.jsx';
import ShippingForm from './components/ShippingForm.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';

const views = {
  supplier: SupplierForm,
  product: ProductForm,
  logistics: LogisticsForm,
  order: OrderForm,
  shipping: ShippingForm,
  employee: EmployeeForm
};

export default function App() {
  const [active, setActive] = useState('order');
  const ActiveComponent = views[active];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Warehouse</h1>
        <button className={`nav-btn ${active==='order'? 'active':''}`} onClick={() => setActive('order')}>Create Order</button>
        <button className={`nav-btn ${active==='shipping'? 'active':''}`} onClick={() => setActive('shipping')}>Create Shipping</button>
        <button className={`nav-btn ${active==='product'? 'active':''}`} onClick={() => setActive('product')}>Add Product</button>
        <button className={`nav-btn ${active==='supplier'? 'active':''}`} onClick={() => setActive('supplier')}>Add Supplier</button>
        <button className={`nav-btn ${active==='logistics'? 'active':''}`} onClick={() => setActive('logistics')}>Add Logistics Co.</button>
        <button className={`nav-btn ${active==='employee'? 'active':''}`} onClick={() => setActive('employee')}>Add Employee</button>
      </aside>
      <main className="content">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}
