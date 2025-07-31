/**
 * Forgot Password Component
 * Allows users to request password reset via email
 * Includes form validation and user feedback
 */

import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ForgotPassword.css';
import { auth } from '../utlis/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const response = await auth.post('/forgot-password', { email: email.trim() });
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-container">
          <div className="forgot-password-header">
            <button 
              className="back-button"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft size={20} />
              Back to Login
            </button>
            <h1>Forgot Password?</h1>
            <p>Enter your email address and we'll send you a link to reset your password</p>
          </div>

          <form className="forgot-password-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn reset-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p>Remember your password?</p>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 