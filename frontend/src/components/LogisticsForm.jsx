import React, { useState } from 'react';
import { createLogistics } from '../api.js';

export default function LogisticsForm() {
  const [form, setForm] = useState({ company_name: '', email: '', phone_no: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      const company = await createLogistics(form);
      setStatus({ ok: true, msg: `Logistics company ${company.company_name} added.` });
      setForm({ company_name: '', email: '', phone_no: '' });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Logistics Company</h2>
      <label>Company Name
        <input name="company_name" value={form.company_name} onChange={handleChange} required />
      </label>
      <label>Email
        <input type="email" name="email" value={form.email} onChange={handleChange} />
      </label>
      <label>Phone Number
        <input name="phone_no" value={form.phone_no} onChange={handleChange} />
      </label>
      <button type="submit">Add Company</button>
      {status && <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>{status.msg}</div>}
    </form>
  );
}
