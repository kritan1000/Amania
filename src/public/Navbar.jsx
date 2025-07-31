/**
 * Navigation Component
 * Main navigation bar with user authentication and cart functionality
 * Includes dropdown menus and responsive design
 */

import React, { use, useEffect, useState } from 'react';
import { ShoppingCart, User, Home, LogIn, Shirt } from 'lucide-react';
import '../Styles/Navbar.css';
import { category } from '../utlis/axios';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';

const Navbar = ({ currentPage, onNavigate }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          // Invalid JSON in localStorage, clear it
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    
    checkAuthStatus();
  }, []);

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
  }, []);
  
  const navigate = useNavigate();
  
  const onCartClear = () => {
    setCartModalOpen(false);
    localStorage.removeItem("cartItems");
    window.location.reload(); // or use onNavigate('home')
  }
  
  const onCartOpen = () => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    console.log("Cart items:", items);
    setCartItems(items);
    setCartModalOpen(true);
  }
  
  const oncloseCart = () => {
    setCartModalOpen(false);
  }
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setUserModalOpen(false);
    window.location.reload(); // or use onNavigate('home')
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-logo">
            <h2>Amania</h2>
          </div>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => navigate('/')}
              >
                <Home size={18} />
                Home
              </button>
            </li>
            {/* Categories Dropdown */}
            <li className="nav-link dropdown" style={{ position: 'relative' }}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}>
              <button className="nav-link" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <Shirt size={18} />
                Categories
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '6px',
                  minWidth: '150px',
                  zIndex: 1000,
                  padding: '8px 0',
                  margin: 0,
                  listStyle: 'none',
                }}>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button className="dropdown-item" 
                      style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer' }} 
                      onClick={() => { 
                        navigate(`/products/${category.name}`);
                        setDropdownOpen(false);
                         }}>
                        {category.name}
                      </button>
                      </li>
                  ))}
                </ul>
              )}
            </li>
            {/* End Categories Dropdown */}
            {!isLoggedIn ? (
              <>
                <li>
                  <button 
                    className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                    onClick={() => navigate('/login')}
                  >
                    <LogIn size={18} />
                    Login
                  </button>
                </li>
                <li>
                  <button 
                    className={`nav-link ${currentPage === 'signup' ? 'active' : ''}`}
                    onClick={() => navigate('/signup')}
                  >
                    <User size={18} />
                    Sign Up
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button className="nav-link" onClick={() => setUserModalOpen(true)}>
                  <User size={18} />
                  {user?.fullname || user?.firstName}
                </button>
                {userModalOpen && (
                  <div className="user-modal">
                    <div >
                      <strong>{user?.fullname || `${user?.firstName} ${user?.lastName}`}</strong>
                      <div>{user?.email}</div>
                    </div>
                    <button className="btn btn-outline"  onClick={handleLogout}>Logout</button>
                    <button className="btn btn-outline"  onClick={() => setUserModalOpen(false)}>Close</button>
                  </div>
                )}
              </li>
            )}
            <li style={{ position: 'relative' }}>
              <button className="nav-link cart-btn" onClick={() => {onCartOpen()}}>
                <ShoppingCart size={18} />
                Cart
              </button>
              {cartModalOpen && (
                <Cart cartItems={cartItems} clearCart={onCartClear} closeCart={oncloseCart} />
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;