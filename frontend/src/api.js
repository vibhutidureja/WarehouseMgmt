const BASE_URL = 'http://localhost:5000/api';

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const listSuppliers = () => api('/suppliers');
export const createSupplier = (data) => api('/suppliers', { method: 'POST', body: JSON.stringify(data) });
export const getSupplierById = (id) => api(`/suppliers/${id}`);

export const listProducts = () => api('/products');
export const createProduct = (data) => api('/products', { method: 'POST', body: JSON.stringify(data) });
export const getProductById = (id) => api(`/products/${id}`);

export const listLogistics = () => api('/logistics');
export const createLogistics = (data) => api('/logistics', { method: 'POST', body: JSON.stringify(data) });

export const listOrders = () => api('/orders');
export const createOrder = (data) => api('/orders', { method: 'POST', body: JSON.stringify(data) });

export const listShipping = () => api('/shipping');
export const createShipping = (data) => api('/shipping', { method: 'POST', body: JSON.stringify(data) });

export const listCustomers = () => api('/customers');
export const createCustomer = (data) => api('/customers', { method: 'POST', body: JSON.stringify(data) });
export const getCustomerById = (id) => api(`/customers/${id}`);

export const listEmployees = () => api('/employees');
export const createEmployee = (data) => api('/employees', { method: 'POST', body: JSON.stringify(data) });
export const getEmployeeBySSN = (ssn) => api(`/employees/${ssn}`);

export const listPayments = () => api('/payments');
export const createPayment = (data) => api('/payments', { method: 'POST', body: JSON.stringify(data) });
export const getPaymentById = (id) => api(`/payments/${id}`);

export default api;
