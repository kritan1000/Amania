/**
 * Main App Component
 * User interface for the Amania clothing store
 * Handles navigation between different pages
 */

import React, { useState } from 'react';
import Navbar from './public/Navbar';
import Homepage from './public/Homepage';
import Login from './public/Login';
import Signup from './public/Signup';
import Products from './public/Products';
import ForgotPassword from './public/ForgotPassword';
import ResetPassword from './public/ResetPassword';
import { createBrowserRouter, Router, RouterProvider } from 'react-router-dom';
import HomeLayout from './public/HomeLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
    const router = createBrowserRouter([
    {
      path: '/',
      element: <HomeLayout />,
children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'signup',
          element: <Signup />,
        },
        {
          path: 'forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: 'reset-password',
          element: <ResetPassword />,
        },
        {
          path: 'products/:category',
          element: <Products />,
        },
        {
          path: 'products',
          element: <Products />,
        }
        ]
    },
  ]);
  
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  );
}

export default App;