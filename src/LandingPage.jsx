import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './LandingPage.css';

const LandingPage = ({ setCurrentPage }) => {
  const featuredProducts = [
    { id: 1, name: "Summer Dress", price: "$89", rating: 4.8 },
    { id: 2, name: "Casual Shirt", price: "$59", rating: 4.6 },
    { id: 3, name: "Denim Jeans", price: "$79", rating: 4.7 },
    { id: 4, name: "Evening Gown", price: "$149", rating: 4.9 }
  ];

  return (
    <div className="landing-page">
      <Header setCurrentPage={setCurrentPage} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Fashion That Speaks Your Style</h1>
          <p>Discover the latest trends in clothing and accessories at Amania</p>
          <div className="hero-buttons">
            <button className="btn">Shop Now</button>
            <button className="btn btn-secondary">View Collection</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Amania?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
              </div>
              <h3>Quality Products</h3>
              <p>Premium quality clothing made with the finest materials and attention to detail.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
              </div>
              <h3>Trendy Styles</h3>
              <p>Stay ahead of fashion trends with our curated collection of stylish clothing.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
          
              </div>
              <h3>Customer Satisfaction</h3>
              <p>Join thousands of satisfied customers who love our service and products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  Fashion Item
                </div>
                <div className="product-info">
                  <div className="product-title">{product.name}</div>
                  <div className="rating">
                
                    <span>{product.rating}</span>
                  </div>
                  <div className="product-price">{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;