import React, { useState, useEffect } from 'react';
import { getDashboard } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load dashboard data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card">
          <span className="card-icon">📋</span>
          <h3>Total Products</h3>
          <p className="card-number">{data.total_products || 0}</p>
        </div>
        <div className="card">
          <span className="card-icon">👥</span>
          <h3>Total Customers</h3>
          <p className="card-number">{data.total_customers || 0}</p>
        </div>
        <div className="card">
          <span className="card-icon">🛒</span>
          <h3>Total Orders</h3>
          <p className="card-number">{data.total_orders || 0}</p>
        </div>
        <div className="card card-warning">
          <span className="card-icon">⚠️</span>
          <h3>Low Stock</h3>
          <p className="card-number">{data.low_stock_products ? data.low_stock_products.length : 0}</p>
        </div>
      </div>

      {data.low_stock_products && data.low_stock_products.length > 0 && (
        <div className="low-stock-section">
          <h2>Low Stock Items</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_products.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td className="low-qty">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
