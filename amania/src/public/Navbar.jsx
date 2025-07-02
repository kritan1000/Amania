import React from 'react';
import { ShoppingCart, User, Home, LogIn } from 'lucide-react';
import '../Styles/Navbar.css';

const Navbar = ({ currentPage, onNavigate }) => {
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
                onClick={() => onNavigate('home')}
              >
                <Home size={18} />
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
              >
                <LogIn size={18} />
                Login
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => onNavigate('signup')}
              >
                <User size={18} />
                Sign Up
              </button>
            </li>
            <li>
              <button className="nav-link cart-btn">
                <ShoppingCart size={18} />
                Cart (0)
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;