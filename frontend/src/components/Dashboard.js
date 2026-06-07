import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getOrders, getProducts } from '../api';
import './Dashboard.css';

function Dashboard() {
  const [data, setData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getDashboard(), getOrders(), getProducts()])
      .then(([dashRes, ordersRes, productsRes]) => {
        setData(dashRes.data);
        setRecentOrders(ordersRes.data.slice(-5).reverse());
        setTopProducts(productsRes.data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load dashboard data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (error) return <div className="error-msg">{error}</div>;

  const totalRevenue = recentOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="dashboard">
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Inventory Dashboard</h1>
          <p className="hero-subtitle">
            Monitor your business metrics, track inventory levels, and manage operations efficiently.
          </p>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card stat-card-products">
          <div className="stat-card-icon">
            <span>📦</span>
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Total Products</p>
            <h2 className="stat-card-value">{data.total_products || 0}</h2>
            <p className="stat-card-desc">Items in inventory</p>
          </div>
        </div>

        <div className="stat-card stat-card-customers">
          <div className="stat-card-icon">
            <span>👥</span>
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Total Customers</p>
            <h2 className="stat-card-value">{data.total_customers || 0}</h2>
            <p className="stat-card-desc">Registered clients</p>
          </div>
        </div>

        <div className="stat-card stat-card-orders">
          <div className="stat-card-icon">
            <span>🛒</span>
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Total Orders</p>
            <h2 className="stat-card-value">{data.total_orders || 0}</h2>
            <p className="stat-card-desc">Orders processed</p>
          </div>
        </div>

        <div className="stat-card stat-card-alert">
          <div className="stat-card-icon">
            <span>⚠️</span>
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Low Stock Alerts</p>
            <h2 className="stat-card-value">{data.low_stock_products ? data.low_stock_products.length : 0}</h2>
            <p className="stat-card-desc">Items need restocking</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-panel recent-orders-panel">
          <div className="panel-header">
            <h2>Recent Orders</h2>
            <button className="panel-action-btn" onClick={() => navigate('/orders')}>
              View All →
            </button>
          </div>
          <div className="panel-body">
            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No orders yet</p>
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="clickable-row" onClick={() => navigate(`/orders/${order.id}`)}>
                      <td><span className="order-badge">#{order.id}</span></td>
                      <td>{order.customer_name || 'N/A'}</td>
                      <td className="amount-cell">₹{parseFloat(order.total || 0).toFixed(2)}</td>
                      <td className="date-cell">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="dashboard-panel inventory-panel">
          <div className="panel-header">
            <h2>Inventory Overview</h2>
            <button className="panel-action-btn" onClick={() => navigate('/products')}>
              View All →
            </button>
          </div>
          <div className="panel-body">
            {topProducts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <p>No products yet</p>
              </div>
            ) : (
              <div className="inventory-list">
                {topProducts.map((product) => (
                  <div key={product.id} className="inventory-item">
                    <div className="inventory-item-info">
                      <h4>{product.name}</h4>
                      <span className="inventory-sku">{product.sku}</span>
                    </div>
                    <div className="inventory-item-stock">
                      <div className="stock-bar-container">
                        <div
                          className={`stock-bar ${product.quantity < 10 ? 'stock-low' : product.quantity < 30 ? 'stock-medium' : 'stock-high'}`}
                          style={{ width: `${Math.min((product.quantity / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`stock-count ${product.quantity < 10 ? 'stock-danger' : ''}`}>
                        {product.quantity} units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert Section */}
      {data.low_stock_products && data.low_stock_products.length > 0 && (
        <div className="low-stock-section">
          <div className="low-stock-header">
            <div className="low-stock-icon-wrapper">
              <span>🔔</span>
            </div>
            <div>
              <h2>Low Stock Alert</h2>
              <p className="low-stock-subtitle">These items need to be restocked soon</p>
            </div>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Remaining Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_products.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td><span className="sku-badge">{item.sku}</span></td>
                  <td className="low-qty">{item.quantity} units</td>
                  <td>
                    <span className={`status-badge ${item.quantity <= 3 ? 'status-critical' : 'status-warning'}`}>
                      {item.quantity <= 3 ? 'Critical' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/products')}>
            <span className="action-icon">📦</span>
            <span className="action-label">Add Product</span>
          </button>
          <button className="action-card" onClick={() => navigate('/customers')}>
            <span className="action-icon">👤</span>
            <span className="action-label">Add Customer</span>
          </button>
          <button className="action-card" onClick={() => navigate('/orders')}>
            <span className="action-icon">🛍️</span>
            <span className="action-label">Create Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
