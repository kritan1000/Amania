/**
 * Navigation Component
 * Main navigation bar with user authentication and cart functionality
 * Includes dropdown menus and responsive design
 */

import React, { useEffect, useState } from 'react';
import { ShoppingCart, User, Home, LogIn, Shirt, Settings, LogOut } from 'lucide-react';
import '../Styles/Navbar.css';
import { category } from '../utlis/axios';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ currentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await category.get('/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Categories fetched:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  
  const onCartClear = () => {
    setCartModalOpen(false);
    localStorage.removeItem("cartItems");
    window.location.reload();
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
    logout();
    setUserModalOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setUserModalOpen(false);
    // TODO: Navigate to profile page when created
    alert('Profile page coming soon!');
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
              <li style={{ position: 'relative' }}>
                <button className="nav-link" onClick={() => setUserModalOpen(!userModalOpen)}>
                  <User size={18} />
                  {user?.fullname || user?.firstName}
                </button>
                {userModalOpen && (
                  <div className="user-modal">
                    <div className="user-info">
                      <strong>{user?.fullname || `${user?.firstName} ${user?.lastName}`}</strong>
                      <div className="user-email">{user?.email}</div>
                    </div>
                    <div className="user-actions">
                      <button className="btn btn-outline profile-btn" onClick={handleProfileClick}>
                        <Settings size={16} />
                        Profile
                      </button>
                      <button className="btn btn-outline logout-btn" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                    <button className="btn btn-outline close-btn" onClick={() => setUserModalOpen(false)}>
                      Close
                    </button>
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