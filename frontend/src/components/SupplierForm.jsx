import React, { useState } from 'react';
import { createSupplier } from '../api.js';

export default function SupplierForm() {
  const [form, setForm] = useState({ name: '', contact: '', email: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      const supplier = await createSupplier(form);
      setStatus({ ok: true, msg: `Supplier ${supplier.name} created.` });
      setForm({ name: '', contact: '', email: '' });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Supplier</h2>
      <label>Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>Contact
        <input name="contact" value={form.contact} onChange={handleChange} />
      </label>
      <label>Email
        <input type="email" name="email" value={form.email} onChange={handleChange} />
      </label>
      <button type="submit">Add Supplier</button>
      {status && <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>{status.msg}</div>}
    </form>
  );
}
