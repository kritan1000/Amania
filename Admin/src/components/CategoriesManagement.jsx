/**
 * Categories Management Component
 * Allows admins to add and view product categories
 * Provides form validation and error handling
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesManagement.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:5000/api/admin/categories', newCategory, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Category added successfully!');
      setNewCategory({ name: '' });
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleChange = (e) => {
    setNewCategory({
      ...newCategory,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Categories Management</h1>
        <p>Add and manage product categories</p>
      </div>

      <div className="categories-content">
        <div className="add-category-section">
          <h2>Add New Category</h2>
          <form onSubmit={handleSubmit} className="add-category-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>
            
            <button type="submit" className="add-button">
              Add Category
            </button>
          </form>
        </div>

        <div className="categories-list-section">
          <h2>Existing Categories</h2>
          {categories.length === 0 ? (
            <div className="no-categories">
              <p>No categories found. Add your first category above.</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-card">
                  <div className="category-icon">🏷️</div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>ID: {category.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement; 