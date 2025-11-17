import React, { useState } from 'react';
import { createProduct, getSupplierById } from '../api.js';

export default function ProductForm() {
  const [form, setForm] = useState({
    p_name: '',
    category: '',
    unit_price: '',
    selling_price: '',
    weight: '',
    supplier_id: ''
  });
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [supplierError, setSupplierError] = useState('');
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

    // Clear supplier details when supplier_id changes
    if (name === 'supplier_id') {
      setSupplierDetails(null);
      setSupplierError('');
    }
  };

  const validateSupplier = async () => {
    if (!form.supplier_id) return;

    try {
      const supplier = await getSupplierById(form.supplier_id);
      setSupplierDetails(supplier);
      setSupplierError('');
    } catch (err) {
      setSupplierDetails(null);
      setSupplierError('Supplier not found');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    // Validate supplier before submitting
    if (form.supplier_id) {
      try {
        await getSupplierById(form.supplier_id);
      } catch (err) {
        setStatus({ ok: false, msg: 'Invalid supplier ID. Please check and try again.' });
        return;
      }
    }

    try {
      const payload = {
        ...form,
        unit_price: parseFloat(form.unit_price) || 0,
        selling_price: parseFloat(form.selling_price) || 0,
        weight: parseFloat(form.weight) || null,
        supplier_id: form.supplier_id ? parseInt(form.supplier_id) : null
      };

      const product = await createProduct(payload);
      setStatus({ ok: true, msg: `Product "${product.p_name}" added successfully.` });

      // Reset form
      setForm({
        p_name: '',
        category: '',
        unit_price: '',
        selling_price: '',
        weight: '',
        supplier_id: ''
      });
      setSupplierDetails(null);
      setSupplierError('');

    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <label>Product Name
        <input
          name="p_name"
          value={form.p_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>Category
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
        />
      </label>

      <label>Unit Price
        <input
          type="number"
          step="0.01"
          name="unit_price"
          value={form.unit_price}
          onChange={handleChange}
          required
        />
      </label>

      <label>Selling Price
        <input
          type="number"
          step="0.01"
          name="selling_price"
          value={form.selling_price}
          onChange={handleChange}
          required
        />
      </label>

      <label>Weight (kg)
        <input
          type="number"
          step="0.01"
          name="weight"
          value={form.weight}
          onChange={handleChange}
        />
      </label>

      <label>Supplier ID
        <input
          type="number"
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          onBlur={validateSupplier}
        />
      </label>

      {supplierDetails && (
        <div style={{ background: '#f0f9ff', padding: '8px', borderRadius: '4px', marginTop: '4px' }}>
          <strong>Supplier Details:</strong><br />
          Name: {supplierDetails.name}<br />
          Email: {supplierDetails.email}
        </div>
      )}

      {supplierError && (
        <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px' }}>
          {supplierError}
        </div>
      )}

      <button type="submit">Add Product</button>
      {status && (
        <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>
          {status.msg}
        </div>
      )}
    </form>
  );
}
