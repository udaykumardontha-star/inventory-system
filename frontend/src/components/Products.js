import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../api';
import ProductForm from './ProductForm';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchProducts = () => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => showMsg('Failed to load products', 'error'));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
        .then(() => {
          showMsg('Product deleted successfully', 'success');
          fetchProducts();
        })
        .catch(() => showMsg('Failed to delete product', 'error'));
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditProduct(null);
    fetchProducts();
    showMsg('Product saved successfully', 'success');
  };

  const handleClose = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  return (
    <div className="products">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Product
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <ProductForm
          product={editProduct}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
