/**
 * Products Component
 * Product listing page with category filtering
 * Displays products in grid layout with search functionality
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Products.css';
import ProductCard from './ProductCard';

function Products({ addToCart, category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Filter products by category if provided
  const filteredProducts = category
    ? products.filter((product) =>
        product.category && product.category.toLowerCase() === category.toLowerCase()
      )
    : products;

  return (
    <section className="products">
      <h2>{category ? `${category}` : 'Our Products'}</h2>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </section>
  );
}

export default Products;