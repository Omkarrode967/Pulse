import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to your Dashboard</h1>
        <div className="user-info">
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="profile-image"
            />
          )}
          <span className="user-name">{user?.displayName || 'User'}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/projects')} className="action-button">
              View Projects
            </button>
            <button onClick={() => navigate('/tasks')} className="action-button">
              View Tasks
            </button>
            <button onClick={() => navigate('/teams')} className="action-button">
              View Teams
            </button>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Active Projects</h3>
            <p className="stat-number">5</p>
          </div>
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p className="stat-number">12</p>
          </div>
          <div className="stat-card">
            <h3>Team Members</h3>
            <p className="stat-number">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 