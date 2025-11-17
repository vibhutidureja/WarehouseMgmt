import React, { useState } from 'react';
import { createOrder, getCustomerById, createCustomer, getProductById } from '../api.js';

export default function OrderForm() {
  const [form, setForm] = useState({
    customer_id: '',
    order_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });
  const [customer, setCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    address: '',
    phone_no: '',
    email_id: ''
  });
  const [orderItems, setOrderItems] = useState([
    { p_id: '', product: null, quantity: 1, amount: 0 }
  ]);
  const [status, setStatus] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    method: 'CC',
    status: 'PAID'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePaymentChange = e => {
    const { name, value } = e.target;
    setPaymentForm(f => ({ ...f, [name]: value }));
  };

  const checkCustomer = async () => {
    if (!form.customer_id) {
      alert('Please enter a customer ID first');
      return;
    }

    try {
      const customerData = await getCustomerById(form.customer_id);
      setCustomer(customerData);
      setShowAddCustomer(false);
      setStatus({ ok: true, msg: 'Customer found!' });
    } catch (err) {
      setCustomer(null);
      setShowAddCustomer(true);
      setStatus({ ok: false, msg: 'Customer not found. You can add them below.' });
    }
  };

  const addCustomer = async () => {
    try {
      const newCustomer = await createCustomer(customerForm);
      setCustomer(newCustomer);
      setForm(f => ({ ...f, customer_id: newCustomer.customer_id.toString() }));
      setShowAddCustomer(false);
      setCustomerForm({ name: '', address: '', phone_no: '', email_id: '' });
      setStatus({ ok: true, msg: 'Customer added successfully!' });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  const checkProduct = async (index) => {
    const item = orderItems[index];
    if (!item.p_id || item.p_id === '') return;

    try {
      const productData = await getProductById(item.p_id);
      let updatedItems = [...orderItems];

      // Check if this product ID already exists in other rows
      const existingIndex = updatedItems.findIndex((existingItem, i) =>
        i !== index && existingItem.product && existingItem.product.p_id === productData.p_id
      );

      if (existingIndex !== -1) {
        // Product already exists, combine quantities
        const newQuantity = updatedItems[existingIndex].quantity + updatedItems[index].quantity;
        updatedItems[existingIndex].quantity = newQuantity;
        updatedItems[existingIndex].amount = productData.selling_price * newQuantity;

        // Remove the current duplicate row
        updatedItems = updatedItems.filter((_, i) => i !== index);

        // If the removed row was not the last one, we might need to add a new empty row at the end
        if (updatedItems.length === 0 || updatedItems[updatedItems.length - 1].product) {
          updatedItems.push({ p_id: '', product: null, quantity: 1, amount: 0 });
        }
      } else {
        // Product doesn't exist, just update the current row
        updatedItems[index].product = productData;
        updatedItems[index].amount = productData.selling_price * updatedItems[index].quantity;
      }

      setOrderItems(updatedItems);
    } catch (err) {
      const updatedItems = [...orderItems];
      updatedItems[index].product = null;
      updatedItems[index].amount = 0;
      setOrderItems(updatedItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;

    if (field === 'quantity' && updatedItems[index].product) {
      updatedItems[index].amount = updatedItems[index].product.selling_price * parseInt(value || 1);
    }

    setOrderItems(updatedItems);

    // Add new row if this is the last item and it has a product ID entered
    if (index === orderItems.length - 1 && field === 'p_id' && value.trim() !== '') {
      setOrderItems([...updatedItems, { p_id: '', product: null, quantity: 1, amount: 0 }]);
    }
  };

  const removeItem = (index) => {
    if (orderItems.length > 1) {
      const updatedItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(updatedItems);
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.amount || 0), 0);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    if (!customer) {
      setStatus({ ok: false, msg: 'Please check and confirm customer details first.' });
      return;
    }

    const validItems = orderItems.filter(item => item.product);
    if (validItems.length === 0) {
      setStatus({ ok: false, msg: 'Please add at least one product to the order.' });
      return;
    }

    // Show payment form instead of creating order directly
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async e => {
    e.preventDefault();
    setStatus(null);

    const validItems = orderItems.filter(item => item.product);
    const totalAmount = calculateTotal();

    try {
      const orderData = {
        customer_id: parseInt(form.customer_id),
        order_date: form.order_date,
        orderDetails: validItems.map(item => ({
          p_id: parseInt(item.p_id),
          quantity: parseInt(item.quantity),
          amount: parseFloat(item.amount)
        })),
        payment: {
          method: paymentForm.method,
          amount: totalAmount,
          status: paymentForm.status
        }
      };

      const result = await createOrder(orderData);
      setStatus({ ok: true, msg: `Order created with ID: ${result.order.order_id} and Payment ID: ${result.payment.payment_id}` });

      // Reset form
      setForm({
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0]
      });
      setCustomer(null);
      setOrderItems([{ p_id: '', product: null, quantity: 1, amount: 0 }]);
      setShowAddCustomer(false);
      setShowPaymentForm(false);
      setPaymentForm({ method: 'CC', status: 'PAID' });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        {!showPaymentForm ? (
          <form onSubmit={handleSubmit}>
            <h2>Create Order</h2>

          <label>Customer ID
            <input
              type="number"
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={checkCustomer} style={{ marginLeft: '10px' }}>
              Check Customer
            </button>
          </label>

          {customer && (
            <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '4px', margin: '10px 0' }}>
              <h3>Customer Details:</h3>
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Phone:</strong> {customer.phone_no}</p>
              <p><strong>Email:</strong> {customer.email_id}</p>
              <p><strong>Address:</strong> {customer.address}</p>
            </div>
          )}

          {showAddCustomer && (
            <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '4px', margin: '10px 0' }}>
              <h3>Add New Customer</h3>
              <label>Name
                <input name="name" value={customerForm.name} onChange={handleCustomerChange} required />
              </label>
              <label>Address
                <textarea name="address" value={customerForm.address} onChange={handleCustomerChange} />
              </label>
              <label>Phone Number
                <input name="phone_no" value={customerForm.phone_no} onChange={handleCustomerChange} />
              </label>
              <label>Email
                <input type="email" name="email_id" value={customerForm.email_id} onChange={handleCustomerChange} />
              </label>
              <button type="button" onClick={addCustomer}>Add Customer</button>
            </div>
          )}

          <h3>Order Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Product ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Product Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Quantity</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input
                      type="number"
                      value={item.p_id}
                      onChange={(e) => handleItemChange(index, 'p_id', e.target.value)}
                      onBlur={() => checkProduct(index)}
                      style={{ width: '80px' }}
                      placeholder="ID"
                    />
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.product ? item.product.p_name : '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.product ? `$${item.product.selling_price}` : '-'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      style={{ width: '60px' }}
                      disabled={!item.product}
                    />
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    ${item.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.product ? item.product.stock_quantity : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <label>Order Date
            <input
              type="date"
              name="order_date"
              value={form.order_date}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Proceed to Payment</button>
          {status && <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>{status.msg}</div>}
        </form>
        ) : (
          <form onSubmit={handlePaymentSubmit}>
            <h2>Payment Details</h2>
            <p><strong>Total Amount: ${calculateTotal().toFixed(2)}</strong></p>

            <label>Payment Method
              <select name="method" value={paymentForm.method} onChange={handlePaymentChange} required>
                <option value="CC">Credit Card</option>
                <option value="DC">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="COD">COD</option>
              </select>
            </label>

            <label>Payment Status
              <select name="status" value={paymentForm.status} onChange={handlePaymentChange} required>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </label>

            <div style={{ marginTop: '20px' }}>
              <button type="submit" style={{ marginRight: '10px' }}>Complete Order & Payment</button>
              <button type="button" onClick={() => setShowPaymentForm(false)} style={{ background: '#6c757d' }}>
                Back to Order
              </button>
            </div>
            {status && <div className={`status-msg ${status.ok ? 'success' : 'error'}`}>{status.msg}</div>}
          </form>
        )}
      </div>

      <div style={{ width: '350px', border: '1px solid #ddd', padding: '20px', borderRadius: '4px', height: 'fit-content' }}>
        <h3>Bill Summary</h3>
        {orderItems.filter(item => item.product).length > 0 ? (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', fontSize: '14px' }}>Product</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>Qty</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: '14px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.filter(item => item.product).map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '14px' }}>{item.product.p_name}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right', fontSize: '14px' }}>${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr style={{ margin: '15px 0' }} />
            <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold' }}>
              Total: ${calculateTotal().toFixed(2)}
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No items added yet</p>
        )}
      </div>
    </div>
  );
}
