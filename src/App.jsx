import React, { useState } from 'react';
import './App.css';

const LoginPage = React.lazy(() => import('./LoginPage.jsx'));
const SignupPage = React.lazy(() => import('./SignUpPage.jsx'));
function App() {
  const [currentPage, setCurrentPage] = useState('Login'); 

  const switchToSignup = () => {
    setCurrentPage('Signup');
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