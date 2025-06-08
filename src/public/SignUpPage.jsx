import React, { useState } from 'react';

  function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    // Success
    alert('Account created successfully! Welcome to Amania!');
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeToTerms: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AMANIA</h1>
          <p className="text-gray-600">Fashion for Everyone</p>
        </div>

        {/* Signup Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Create Account
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Name Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Create Account Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Create Account
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignupPage;  