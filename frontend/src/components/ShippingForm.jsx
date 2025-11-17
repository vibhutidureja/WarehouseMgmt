import React, { useEffect, useState } from 'react';
import { listOrders, listLogistics, createShipping } from '../api.js';

export default function ShippingForm() {
  const [orders, setOrders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    tracking_id: '',
    order_id: '',
    logistics_id: '',
    status: 'NOT DISPATCHED'
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    listOrders().then(setOrders).catch(console.error);
    listLogistics().then(setCompanies).catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      const created = await createShipping(form);
      setStatus({ ok: true, msg: `Shipping created with tracking ID: ${created.tracking_id}` });
      setForm({
        tracking_id: '',
        order_id: '',
        logistics_id: '',
        status: 'NOT DISPATCHED'
      });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Shipping</h2>

      <label>Tracking ID
        <input
          type="number"
          name="tracking_id"
          value={form.tracking_id}
          onChange={handleChange}
          required
        />
      </label>

      <label>Order
        <select name="order_id" value={form.order_id} onChange={handleChange} required>
          <option value=''>Select order</option>
          {orders.map(o => (
            <option key={o.order_id} value={o.order_id}>
              Order #{o.order_id} - {o.order_date}
            </option>
          ))}
        </select>
      </label>

      <label>Logistics Company
        <select name="logistics_id" value={form.logistics_id} onChange={handleChange} required>
          <option value=''>Select company</option>
          {companies.map(c => (
            <option key={c.logistics_id} value={c.logistics_id}>
              {c.company_name}
            </option>
          ))}
        </select>
      </label>

      <label>Status
        <select name="status" value={form.status} onChange={handleChange} required>
          <option value="NOT DISPATCHED">NOT DISPATCHED</option>
          <option value="DISPATCHED">DISPATCHED</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>
      </label>

      <button type="submit">Create Shipping</button>
      {status && <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>{status.msg}</div>}
    </form>
  );
}
