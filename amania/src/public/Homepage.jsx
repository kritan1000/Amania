import React from 'react';
import { Star, Truck, CreditCard, Shield } from 'lucide-react';
import '../Styles/Homepage.css';

const Homepage = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Classic Denim Jacket",
      price: "NPR 4,599",
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5
    },
    {
      id: 2,
      name: "Comfort Hoodie",
      price: "NPR 2,999",
      image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 4
    },
    {
      id: 3,
      name: "Student Backpack",
      price: "NPR 3,499",
      image: "https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 5
    },
    {
      id: 4,
      name: "Campus T-Shirt",
      price: "NPR 1,999",
      image: "https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=300",
      rating: 4
    }
  ];

  const categories = [
    { name: "T-Shirts", count: "25+ Items" },
    { name: "Hoodies", count: "15+ Items" },
    { name: "Jeans", count: "20+ Items" },
    { name: "Accessories", count: "30+ Items" }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Amania Fashion Store</h1>
            <p>Affordable, stylish clothing for students on a budget</p>
            <button className="btn hero-btn">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <h3>{category.name}</h3>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
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
                  <button className="btn">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <Truck size={40} color="#8b4513" />
              <h3>Free Shipping</h3>
              <p>On orders over NPR 3,000</p>
            </div>
            <div className="feature">
              <CreditCard size={40} color="#8b4513" />
              <h3>Secure Payment</h3>
              <p>100% secure checkout</p>
            </div>
            <div className="feature">
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