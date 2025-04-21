import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import teamLogo from '../assets/images/Screenshot 2025-04-13 032357.png';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(prev => !prev);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark' : ''}`}>
      <div className="navbar-left">
        <div className="app-icon" onClick={handleLogoClick}>
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
          ref={menuRef}
          className="avatar-container"
          onClick={toggleUserMenu}
        >
          {user ? (
            <>
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=4f46e5&color=fff`}
                alt="User avatar" 
                className="avatar"
              />
              <div className="user-info">
                <span className="user-email">{user.displayName || user.email}</span>
                <span className="user-role">Team Member</span>
              </div>
              {showUserMenu && (
                <div className="user-menu">
                  <div 
                    className="menu-item" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileClick();
                    }}
                  >
                    <span className="icon">👤</span>
                    Profile
                  </div>
                  <div 
                    className="menu-item"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="icon">⚙️</span>
                    Settings
                  </div>
                  <div className="menu-divider"></div>
                  <div 
                    className="menu-item" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                  >
                    <span className="icon">🚪</span>
                    Logout
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <img 
                src="https://ui-avatars.com/api/?name=Guest&background=4f46e5&color=fff" 
                alt="Guest avatar" 
                className="avatar"
              />
              <div className="user-info">
                <span className="user-email">Guest</span>
                <span className="user-role">Not logged in</span>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 