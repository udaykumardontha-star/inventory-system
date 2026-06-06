import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api';
import './ProductForm.css';

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || '',
        quantity: product.quantity || '',
      });
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.sku.trim()) newErrors.sku = 'SKU is required';
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0)
      newErrors.price = 'Price must be a number >= 0';
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0)
      newErrors.quantity = 'Quantity must be a number >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: form.name,
      sku: form.sku,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    const request = product
      ? updateProduct(product.id, data)
      : createProduct(data);

    request
      .then(() => onSave())
      .catch(() => setErrors({ submit: 'Failed to save product' }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
            />
            {errors.sku && <span className="field-error">{errors.sku}</span>}
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            {errors.price && <span className="field-error">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="0"
            />
            {errors.quantity && <span className="field-error">{errors.quantity}</span>}
          </div>
          {errors.submit && <div className="field-error">{errors.submit}</div>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
