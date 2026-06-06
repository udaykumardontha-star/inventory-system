import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, deleteOrder } from '../api';
import OrderForm from './OrderForm';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const fetchOrders = () => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => showMsg('Failed to load orders', 'error'));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(id)
        .then(() => {
          showMsg('Order deleted successfully', 'success');
          fetchOrders();
        })
        .catch(() => showMsg('Failed to delete order', 'error'));
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchOrders();
    showMsg('Order created successfully', 'success');
  };

  return (
    <div className="orders">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Create Order
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <OrderForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="clickable-row"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td>#{order.id}</td>
                  <td>{order.customer_name || 'N/A'}</td>
                  <td>${parseFloat(order.total || 0).toFixed(2)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={(e) => handleDelete(e, order.id)}
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

export default Orders;
