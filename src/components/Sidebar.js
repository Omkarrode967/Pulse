import React, { useState } from 'react';
import './Sidebar.css';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle(isCollapsed);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <button className="toggle-button" onClick={handleToggle}>
        {isCollapsed ? '→' : '←'}
      </button>
      <div className="sidebar-menu">
        <div 
          className={`menu-item ${isActive('/home') ? 'active' : ''}`}
          onClick={() => handleNavigation('/home')}
        >
          <span className="icon">📊</span>
          {!isCollapsed && <span>Dashboard</span>}
        </div>
        <div 
          className={`menu-item ${isActive('/projects') ? 'active' : ''}`}
          onClick={() => handleNavigation('/projects')}
        >
          <span className="icon">📋</span>
          {!isCollapsed && <span>Projects</span>}
        </div>
        <div 
          className={`menu-item ${isActive('/tasks') ? 'active' : ''}`}
          onClick={() => handleNavigation('/tasks')}
        >
          <span className="icon">✅</span>
          {!isCollapsed && <span>Tasks</span>}
        </div>
        <div 
          className={`menu-item ${isActive('/teams') ? 'active' : ''}`}
          onClick={() => handleNavigation('/teams')}
        >
          <span className="icon">👥</span>
          {!isCollapsed && <span>Team</span>}
        </div>
        <div 
          className={`menu-item ${isActive('/analytics') ? 'active' : ''}`}
          onClick={() => handleNavigation('/analytics')}
        >
          <span className="icon">📈</span>
          {!isCollapsed && <span>Analytics</span>}
        </div>
        <div 
          className={`menu-item ${isActive('/calendar') ? 'active' : ''}`}
          onClick={() => handleNavigation('/calendar')}
        >
          <span className="icon">📅</span>
          {!isCollapsed && <span>Calendar</span>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 