/**
 * Homepage Component
 * Main landing page with category display and product showcase
 * Features responsive design and category navigation
 */

import React, { useState, useEffect } from 'react';
import { Star, Truck, CreditCard, Shield } from 'lucide-react';
import '../Styles/Homepage.css';
import { category, products } from '../utlis/axios';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../utlis/addToCart';

const Homepage = ({ onCategoryClick }) => {
  const [loading, setLoading] = useState(true);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [categories,setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [ripple, setRipple] = useState({ show: false, x: 0, y: 0, index: null });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
      const token = localStorage.getItem('token');
        const response = await category.get('/',{
        headers: { Authorization: `Bearer ${token}` }
      });
        console.log("Categories fetched:", response.data);
        
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }}
      fetchCategories();
      const fetchFeaturedProducts = async () => {
        try {
          const response = await products.get('/');
          console.log("Featured products fetched:", response.data);
          setFeaturedProducts(response.data);
        } catch (error) {
          console.error("Error fetching featured products:", error);
        }}
        fetchFeaturedProducts();
    const timer = setTimeout(() => setLoading(false), 1500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);
  

  // const featuredProducts = [
  //   {
  //     id: 1,
  //     name: "Classic Denim Jacket",
  //     price: "NPR 4,599",
  //     image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     rating: 5
  //   },
  //   {
  //     id: 2,
  //     name: "Comfort Hoodie",
  //     price: "NPR 2,999",
  //     image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     rating: 4
  //   },
  //   {
  //     id: 3,
  //     name: "Student Backpack",
  //     price: "NPR 3,499",
  //     image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     rating: 5
  //   },
  //   {
  //     id: 4,
  //     name: "Campus T-Shirt",
  //     price: "NPR 1,999",
  //     image: "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300",
  //     rating: 4
  //   }
  // ];

  const handleCategoryClick = (e, category, index) => {
    // Ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ show: true, x, y, index });
    setClickedIndex(index);
    setTimeout(() => {
      setRipple({ show: false, x: 0, y: 0, index: null });
      setClickedIndex(null);
      if (onCategoryClick) onCategoryClick(category);
    }, 500);
    window.location.href=`/products/${category}`; // Navigate to products page with category
  };

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="spinner"></div>
        <span className="loading-text">Loading...</span>
      </div>
    );
  }

  return (
    <div className="homepage animate-fade-in">
      {/* Hero Section */}
      <section className="hero animate-slide-down">
        <div className="container">
          <div className="hero-content">
            <h1>Amania Fashion Store</h1>
            <p>Affordable, stylish clothing for students on a budget</p>
            <button className="btn hero-btn">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories animate-fade-in-delay">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`category-card animate-pop-in${clickedIndex === index ? ' clicked' : ''}`}
                onClick={e => handleCategoryClick(e, category.name, index)}
                style={{ cursor: 'pointer' }}
              >
                {ripple.show && ripple.index === index && (
                  <span
                    className="ripple"
                    style={{ left: ripple.x, top: ripple.y, width: 80, height: 80 }}
                  />
                )}
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products animate-fade-in-delay2">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts?.slice(0,4).map(product => (
              <div key={product.id} className="product-card animate-pop-in">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < product.rating ? "#ffd700" : "none"}
                        color={i < product.rating ? "#ffd700" : "#ccc"}
                      />
                    ))}
                  </div>
                  <p className="price">{product.price}</p>
                  <button className="btn" onClick={()=>addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features animate-fade-in-delay3">
        <div className="container">
          <div className="features-grid">
            <div className="feature animate-pop-in">
              <Truck size={40} color="#8b4513" />
              <h3>Free Shipping</h3>
              <p>On orders over NPR 3,000</p>
            </div>
            <div className="feature animate-pop-in">
              <CreditCard size={40} color="#8b4513" />
              <h3>Secure Payment</h3>
              <p>100% secure checkout</p>
            </div>
            <div className="feature animate-pop-in">
              <Shield size={40} color="#8b4513" />
              <h3>Quality Guarantee</h3>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;