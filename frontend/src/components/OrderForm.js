import React, { useState, useEffect } from 'react';
import { getCustomers, getProducts, createOrder } from '../api';
import './OrderForm.css';

function OrderForm({ onSave, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCustomers().then((res) => setCustomers(res.data));
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const prod = products.find((p) => p.id === Number(item.product_id));
      if (prod) {
        return sum + prod.price * Number(item.quantity || 0);
      }
      return sum;
    }, 0);
  };

  const validate = () => {
    const newErrors = {};
    if (!customerId) newErrors.customer = 'Please select a customer';
    const hasEmptyProduct = items.some((item) => !item.product_id);
    if (hasEmptyProduct) newErrors.items = 'Please select a product for each item';
    const hasInvalidQty = items.some(
      (item) => !item.quantity || Number(item.quantity) < 1
    );
    if (hasInvalidQty) newErrors.items = 'Quantity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderData = {
      customer_id: Number(customerId),
      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    createOrder(orderData)
      .then(() => onSave())
      .catch((err) => {
        const msg = err.response?.data?.error || 'Failed to create order';
        setErrors({ submit: msg });
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-wide">
        <div className="modal-header">
          <h2>Create Order</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            >
              <option value="">-- Select Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.customer && (
              <span className="field-error">{errors.customer}</span>
            )}
          </div>

          <div className="order-items-section">
            <label>Order Items</label>
            {items.map((item, index) => (
              <div className="order-item-row" key={index}>
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${parseFloat(p.price).toFixed(2)} (Stock: {p.quantity})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="qty-input"
                />
                <button
                  type="button"
                  className="btn btn-small btn-delete"
                  onClick={() => removeItem(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-add-item"
              onClick={addItem}
            >
              + Add Item
            </button>
            {errors.items && (
              <span className="field-error">{errors.items}</span>
            )}
          </div>

          <div className="order-total">
            <strong>Total: ${getTotal().toFixed(2)}</strong>
          </div>

          {errors.submit && <div className="field-error">{errors.submit}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create Order
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
