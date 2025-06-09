import React from 'react';
import './Header.css';

const Header = ({ setCurrentPage }) => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <a href="#" className="logo" onClick={() => setCurrentPage('landing')}>
            Amania
          </a>
          <ul className="nav-links">
            <li><a href="#" onClick={() => setCurrentPage('landing')}>Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Women</a></li>
            <li><a href="#">Men</a></li>
            <li><a href="#">Kids</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <div className="nav-icons">
            <button className="icon-btn">
              <Search size={20} />
            </button>
            <button className="icon-btn">
              <Heart size={20} />
            </button>
            <button className="icon-btn" onClick={() => setCurrentPage('login')}>
              <User size={20} />
            </button>
            <button className="icon-btn">
              <ShoppingBag size={20} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;