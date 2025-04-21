import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please make sure pop-ups are enabled and try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/logo.png" alt="Pulse Logo" className="login-logo" />
          <h1>Welcome to Pulse</h1>
          <p>Sign in to continue to your dashboard</p>
        </div>
        
        {(error || authError) && (
          <div className="error-message">
            {error || authError}
          </div>
        )}

        <button onClick={handleLogin} className="google-signin-button">
          <img src="/google-icon.png" alt="Google" className="google-icon" />
          Sign in with Google
        </button>

        <div className="login-footer">
          <p>By continuing, you agree to Pulse's</p>
          <div className="login-links">
            <a href="/terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
} 