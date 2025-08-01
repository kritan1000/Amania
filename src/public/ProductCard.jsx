/**
 * Product Card Component
 * Individual product display with add to cart functionality
 * Features product image, price, and action buttons
 */

import React from 'react';
import '../Styles/ProductCard.css';
import { addToCart } from '../utlis/addToCart';

function ProductCard({ product }) {
  const productData = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image_url,
  };
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() =>{ addToCart(productData)}}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;