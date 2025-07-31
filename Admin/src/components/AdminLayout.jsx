/**
 * Admin Layout Component
 * Provides shared navigation and layout for all admin pages
 * Includes sidebar navigation and logout functionality
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <h2>Amania Admin</h2>
        </div>
        <div className="admin-navbar-user">
          <span>Welcome, {adminData?.username}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-content">
        <div className="admin-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`sidebar-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
              onClick={() => navigateTo('/admin/dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`sidebar-item ${isActive('/admin/categories') ? 'active' : ''}`}
              onClick={() => navigateTo('/admin/categories')}
            >
              Categories
            </button>
            <button 
              className={`sidebar-item ${isActive('/admin/products') ? 'active' : ''}`}
              onClick={() => navigateTo('/admin/products')}
            >
              Products
            </button>
          </div>
        </div>

        <div className="admin-main">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 