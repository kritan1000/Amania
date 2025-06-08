import React, { useState } from 'react';
import './App.css';

// Import the components with explicit paths
const LoginPage = React.lazy(() => import('./LoginPage.jsx'));
const SignupPage = React.lazy(() => import('./SignupPage.jsx'));

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'signup'

  const switchToSignup = () => {
    setCurrentPage('signup');
  };

  const switchToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading...</div>}>
        {currentPage === 'login' ? (
          <LoginPage onSwitchToSignup={switchToSignup} />
        ) : (
          <SignupPage onSwitchToLogin={switchToLogin} />
        )}
      </React.Suspense>
    </div>
  );
}

export default App;