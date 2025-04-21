import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Store user data in localStorage
    const userData = {
      email: email,
      name: email.split('@')[0], // Using part before @ as name
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Navigate to home page
    navigate('/home');
  };

  return (
    <div className={`login-page ${isDarkMode ? 'dark' : ''}`}>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome to Pulse</h1>
            <p>Sign in to continue to your dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 