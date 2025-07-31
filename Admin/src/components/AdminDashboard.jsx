/**
 * Admin Dashboard Component
 * Provides overview statistics and quick actions for admin users
 * Displays total products and categories with navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');
    
    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(admin));
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products', { headers }),
        axios.get('http://localhost:5000/api/categories', { headers })
      ]);

      setStats({
        totalProducts: productsRes.data.length,
        totalCategories: categoriesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Amania Clothing Store Admin Panel</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>{stats.totalCategories}</h3>
            <p>Total Categories</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button 
            className="action-button"
            onClick={() => navigateTo('/admin/categories')}
          >
            Add New Category
          </button>
          <button 
            className="action-button"
            onClick={() => navigateTo('/admin/products')}
          >
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 