/**
 * Products Management Component
 * Provides full CRUD operations for products
 * Includes edit, delete functionality with confirmation dialogs
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products', { headers }),
        axios.get('http://localhost:5000/api/categories', { headers })
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      setError('Name, price, and category are required');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price)
      };

      await axios.post('http://localhost:5000/api/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        image: '',
        categoryId: ''
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const productData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price)
      };

      await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Product updated successfully!');
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Product deleted successfully!');
      fetchData();
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: value
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  const startEdit = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || '',
      categoryId: product.categoryId.toString()
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products Management</h1>
        <p>Add, edit, and manage products</p>
      </div>

      <div className="products-content">
        <div className="add-product-section">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={editingProduct ? handleEdit : handleSubmit} className="add-product-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingProduct ? editingProduct.name : newProduct.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={editingProduct ? editingProduct.price : newProduct.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                value={editingProduct ? editingProduct.categoryId : newProduct.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editingProduct ? editingProduct.description : newProduct.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={editingProduct ? editingProduct.image : newProduct.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-buttons">
              {editingProduct ? (
                <>
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button type="button" onClick={cancelEdit} className="cancel-button">
                    Cancel
                  </button>
                </>
              ) : (
                <button type="submit" className="add-button">
                  Add Product
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-list-section">
          <h2>Existing Products</h2>
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found. Add your first product above.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price}</p>
                    <p className="product-category">{product.Category?.name || 'No Category'}</p>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                  </div>
                  <div className="product-actions">
                    <button 
                      onClick={() => startEdit(product)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
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

export default ProductsManagement; 