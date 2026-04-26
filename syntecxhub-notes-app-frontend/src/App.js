import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard'; 
import ProfilePage from './pages/ProfilePage';

function App() {
  // check the token
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Dashboard Route */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Route */}
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;