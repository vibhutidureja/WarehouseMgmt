import React, { useState } from 'react';
import { createEmployee, getEmployeeBySSN } from '../api.js';

// Function to generate a random 9-character alphanumeric SSN
const generateSSN = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function EmployeeForm() {
  const [form, setForm] = useState({
    ssn: generateSSN(),
    name: '',
    DOB: '',
    salary: '',
    mgr_ssn: '',
    phone: '',
    email: '',
    start_date: ''
  });
  const [manager, setManager] = useState(null);
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    // If mgr_ssn is being changed, reset manager validation
    if (name === 'mgr_ssn') {
      setManager(null);
    }
  };

  const checkManager = async () => {
    if (!form.mgr_ssn.trim()) {
      setManager({ error: 'Please enter a manager SSN first' });
      return;
    }

    try {
      const managerData = await getEmployeeBySSN(form.mgr_ssn);
      setManager({ name: managerData.name, valid: true });
    } catch (err) {
      setManager({ error: 'Employee with that SSN does not exist', valid: false });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    try {
      const employeeData = {
        ...form,
        salary: parseFloat(form.salary),
        DOB: new Date(form.DOB),
        start_date: new Date(form.start_date),
        mgr_ssn: form.mgr_ssn.trim() || null
      };

      const created = await createEmployee(employeeData);
      setStatus({ ok: true, msg: `Employee ${created.name} added with SSN: ${created.ssn}` });

      // Generate new SSN and reset form
      setForm({
        ssn: generateSSN(),
        name: '',
        DOB: '',
        salary: '',
        mgr_ssn: '',
        phone: '',
        email: '',
        start_date: ''
      });
      setManager(null);
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Employee</h2>

      <label>SSN (Auto-generated)
        <input
          name="ssn"
          value={form.ssn}
          onChange={handleChange}
          required
          readOnly
          style={{ backgroundColor: '#f5f5f5' }}
        />
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, ssn: generateSSN() }))}
          style={{ marginLeft: '10px' }}
        >
          Generate New
        </button>
      </label>

      <label>Name
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>Date of Birth
        <input
          type="date"
          name="DOB"
          value={form.DOB}
          onChange={handleChange}
          required
        />
      </label>

      <label>Salary
        <input
          type="number"
          step="500"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          required
        />
      </label>

      <label>Manager SSN
        <input
          name="mgr_ssn"
          value={form.mgr_ssn}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={checkManager}
          style={{ marginLeft: '10px' }}
          disabled={!form.mgr_ssn.trim()}
        >
          Check Manager
        </button>
      </label>

      {manager && (
        <div style={{
          background: manager.valid ? '#f0fff4' : '#fef2f2',
          padding: '8px',
          borderRadius: '4px',
          margin: '5px 0',
          fontSize: '14px'
        }}>
          {manager.valid ? (
            <span>✅ Manager: {manager.name}</span>
          ) : (
            <span>❌ {manager.error}</span>
          )}
        </div>
      )}

      <label>Phone
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          maxLength="10"
        />
      </label>

      <label>Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </label>

      <label>Start Date
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Add Employee</button>
      {status && <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>{status.msg}</div>}
    </form>
  );
}