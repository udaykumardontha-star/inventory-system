import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, getOrders, getProducts } from '../api';
import './Dashboard.css';

// Professional SVG Icons
const BoxIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const UsersIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const CartIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const AlertIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const BellIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const LayoutIcon = ({ size = 48 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const UserPlusIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>;
const BagIcon = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

function Dashboard() {
  const [data, setData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getDashboard(), getOrders(), getProducts()])
      .then(([dashRes, ordersRes, productsRes]) => {
        setData(dashRes.data);
        setRecentOrders(ordersRes.data.slice(-5).reverse());
        setTopProducts(productsRes.data.slice(0, 5));
        
        const totalValue = productsRes.data.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.quantity)), 0);
        setInventoryValue(totalValue);
        
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

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card stat-card-products" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-icon">
            <BoxIcon size={28} />
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Total Products</p>
            <h2 className="stat-card-value">{data.total_products || 0}</h2>
            <p className="stat-card-desc">Items in inventory</p>
          </div>
        </div>

        <div className="stat-card stat-card-customers" onClick={() => navigate('/customers')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-icon">
            <UsersIcon size={28} />
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Total Customers</p>
            <h2 className="stat-card-value">{data.total_customers || 0}</h2>
            <p className="stat-card-desc">Registered clients</p>
          </div>
        </div>

        <div className="stat-card stat-card-customers">
          <div className="stat-card-icon">
            <BagIcon size={28} />
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Inventory Value</p>
            <h2 className="stat-card-value" style={{ color: 'var(--accent-600)', fontSize: '1.5rem', whiteSpace: 'nowrap' }}>
              {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 1 }).format(inventoryValue)}
            </h2>
            <p className="stat-card-desc">Total asset value</p>
          </div>
        </div>

        <div className="stat-card stat-card-orders" onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-icon">
            <CartIcon size={28} />
          </div>
          <div className="stat-card-info">
            <p className="stat-card-label">Total Orders</p>
            <h2 className="stat-card-value">{data.total_orders || 0}</h2>
            <p className="stat-card-desc">Orders processed</p>
          </div>
        </div>

        <div className="stat-card stat-card-alert">
          <div className="stat-card-icon">
            <AlertIcon size={28} />
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
                <span className="empty-icon"><LayoutIcon /></span>
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
                <span className="empty-icon"><BoxIcon size={48} /></span>
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
            <div className="low-stock-icon-wrapper" style={{ color: 'white' }}>
              <BellIcon />
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
            <span className="action-icon" style={{ color: 'var(--primary-600)' }}><BoxIcon size={28} /></span>
            <span className="action-label">Add Product</span>
          </button>
          <button className="action-card" onClick={() => navigate('/customers')}>
            <span className="action-icon" style={{ color: 'var(--accent-600)' }}><UserPlusIcon size={28} /></span>
            <span className="action-label">Add Customer</span>
          </button>
          <button className="action-card" onClick={() => navigate('/orders')}>
            <span className="action-icon" style={{ color: 'var(--success-600)' }}><BagIcon size={28} /></span>
            <span className="action-label">Create Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
