import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from '../api';
import CustomerForm from './CustomerForm';
import './Customers.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchCustomers = () => {
    getCustomers()
      .then((res) => setCustomers(res.data))
      .catch(() => showMsg('Failed to load customers', 'error'));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id)
        .then(() => {
          showMsg('Customer deleted successfully', 'success');
          fetchCustomers();
        })
        .catch(() => showMsg('Failed to delete customer', 'error'));
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchCustomers();
    showMsg('Customer added successfully', 'success');
  };

  return (
    <div className="customers">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Customer
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {showForm && (
        <CustomerForm
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={() => handleDelete(customer.id)}
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

export default Customers;
