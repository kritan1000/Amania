import React, { useState } from 'react';

const LoginPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
    alert('Login functionality would be implemented here!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Amania account</p>
        </div>
        
        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </div>
          
          <button onClick={handleSubmit} className="auth-btn">
            Sign In
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Don't have an account? <a href="#" onClick={() => setCurrentPage('signup')}>Sign up</a></p>
          <p><a href="#" onClick={() => setCurrentPage('landing')}>Back to Home</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;