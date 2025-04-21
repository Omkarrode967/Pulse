import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useTheme } from '../context/ThemeContext';
import teamLogo from '../assets/images/Screenshot 2025-04-13 032357.png';
import { Link } from 'react-router-dom';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark' : ''}`}>
      <div className="navbar-left">
        <div className="app-icon">
          <img src={teamLogo} alt="Team Logo" className="team-logo" />
          <span className="icon-text">Pulse</span>
        </div>
      </div>
      <div className="navbar-right">
        <button className="nav-button" onClick={toggleTheme}>
          <span className="icon">{isDarkMode ? '☀️' : '🌙'}</span>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="nav-button">
          <span className="icon">⚙️</span>
          Settings
        </button>
        <button className="nav-button">
          <span className="icon">✨</span>
          Features
        </button>
        <Link to="/tasks" className="nav-button">
          <span className="icon">📋</span>
          Tasks
        </Link>
        <div 
          className="avatar-container"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          {user ? (
            <>
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=4f46e5&color=fff`}
                alt="User avatar" 
                className="avatar"
              />
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <span className="user-role">Team Member</span>
              </div>
              {showUserMenu && (
                <div className="user-menu">
                  <div className="menu-item">
                    <span className="icon">👤</span>
                    Profile
                  </div>
                  <div className="menu-item">
                    <span className="icon">⚙️</span>
                    Settings
                  </div>
                  <div className="menu-divider"></div>
                  <div className="menu-item" onClick={handleLogout}>
                    <span className="icon">🚪</span>
                    Logout
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <img 
                src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff" 
                alt="User avatar" 
                className="avatar"
              />
              <span className="avatar-name">Guest</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 