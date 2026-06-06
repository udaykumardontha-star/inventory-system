import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../api';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load order details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!order) return <div className="error-msg">Order not found</div>;

  return (
    <div className="order-details">
      <button className="btn btn-back" onClick={() => navigate('/orders')}>
        ← Back to Orders
      </button>

      <div className="order-info-card">
        <h1>Order Details</h1>
        <div className="order-info">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Customer:</strong> {order.customer_name || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Total:</strong> ${parseFloat(order.total || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="order-items-card">
        <h2>Order Items</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name || 'Unknown'}</td>
                  <td>{item.quantity}</td>
                  <td>${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetails;
