import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Settings.css';

function Settings() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    projectUpdates: true
  });
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [language, setLanguage] = useState('en');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    console.log('Current user:', user);
    if (!user) {
      console.log('No user found, redirecting to login...');
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add password change logic here
    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    // Implement password change logic
    setSuccessMessage('Password changed successfully');
  };

  const handleSaveSettings = () => {
    try {
      // Here you would typically save settings to your backend
      localStorage.setItem('userSettings', JSON.stringify({
        notifications,
        timezone,
        language
      }));
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className={`settings-page ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="settings-container">
            <div className="loading-spinner">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`settings-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="settings-container">
          <div className="settings-header">
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </div>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <div className="settings-sections">
            {user && (
              <>
                <div className="settings-section">
                  <h2>Account Information</h2>
                  <div className="settings-card">
                    <div className="info-item">
                      <label>Profile Picture</label>
                      <div className="profile-picture-container">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=4f46e5&color=fff`}
                          alt="Profile" 
                          className="profile-picture"
                        />
                      </div>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Display Name</label>
                      <p>{user.displayName || 'Not set'}</p>
                    </div>
                    <div className="info-item">
                      <label>Account Created</label>
                      <p>{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Last Sign In</label>
                      <p>{user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Security</h2>
                  <div className="settings-card">
                    <form onSubmit={handlePasswordChange} className="password-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="password-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="password-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="password-input"
                        />
                      </div>
                      <button type="submit" className="change-password-button">
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Appearance</h2>
                  <div className="settings-card">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Theme</h3>
                        <p>Choose between light and dark mode</p>
                      </div>
                      <button 
                        className="theme-toggle"
                        onClick={toggleTheme}
                      >
                        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Notifications</h2>
                  <div className="settings-card">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Email Notifications</h3>
                        <p>Receive email updates about your projects and tasks</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Push Notifications</h3>
                        <p>Get real-time updates in your browser</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Task Updates</h3>
                        <p>Get notified about task changes</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.taskUpdates}
                          onChange={() => handleNotificationChange('taskUpdates')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Project Updates</h3>
                        <p>Get notified about project changes</p>
                      </div>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={notifications.projectUpdates}
                          onChange={() => handleNotificationChange('projectUpdates')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h2>Preferences</h2>
                  <div className="settings-card">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Time Zone</h3>
                        <p>Set your local time zone</p>
                      </div>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="timezone-select"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Asia/Kolkata">India Standard Time</option>
                        <option value="Europe/London">British Time</option>
                        <option value="Europe/Paris">Central European Time</option>
                        <option value="Asia/Tokyo">Japan Time</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <h3>Language</h3>
                        <p>Choose your preferred language</p>
                      </div>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-select"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="settings-actions">
            <button className="save-button" onClick={handleSaveSettings}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 