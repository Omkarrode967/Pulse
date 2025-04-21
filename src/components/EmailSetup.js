import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { configureEmailJS, isEmailJSConfigured } from '../services/emailService';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import './EmailSetup.css';

function EmailSetup() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if EmailJS is already configured
    setIsConfigured(isEmailJSConfigured());
  }, []);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId || !serviceId || !templateId) {
      setError('Please fill in all fields');
      return;
    }

    try {
      configureEmailJS(userId, serviceId, templateId);
      setSuccess('EmailJS configured successfully!');
      setIsConfigured(true);
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to configure EmailJS. Please check your credentials.');
    }
  };

  return (
    <div className={`email-setup-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="email-setup-container">
          <div className="section-header">
            <h2>Configure Email Notifications</h2>
            <span className="section-icon gradient-blue">✉️</span>
          </div>
          
          <div className="email-setup-card">
            <p className="setup-description">
              To enable email notifications, you need to set up EmailJS. Follow these steps:
            </p>
            
            <ol className="setup-steps">
              <li>Sign up for a free account at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">EmailJS</a></li>
              <li>Create an email service (Gmail, Outlook, etc.)</li>
              <li>Create an email template</li>
              <li>Copy your User ID, Service ID, and Template ID below</li>
            </ol>

            {isConfigured && (
              <div className="success-message">
                EmailJS is already configured! You can update your settings below.
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="email-setup-form">
              <div className="form-group">
                <label htmlFor="userId">EmailJS User ID</label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your EmailJS User ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="serviceId">Email Service ID</label>
                <input
                  type="text"
                  id="serviceId"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  placeholder="Enter your Email Service ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="templateId">Email Template ID</label>
                <input
                  type="text"
                  id="templateId"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  placeholder="Enter your Email Template ID"
                />
              </div>

              <button type="submit" className="submit-button">
                {isConfigured ? 'Update Configuration' : 'Configure EmailJS'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailSetup; 