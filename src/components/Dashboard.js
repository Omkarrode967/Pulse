import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getTimeOfDay()}, {user?.displayName?.split(' ')[0] || 'User'}</h1>
          <p className="subtitle">Welcome to your project management dashboard</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <div className="action-card" onClick={() => navigate('/projects')}>
              <div className="card-icon projects">
                <span>📋</span>
              </div>
              <h3>View Projects</h3>
              <p>Manage and track your active projects</p>
            </div>

            <div className="action-card" onClick={() => navigate('/tasks')}>
              <div className="card-icon tasks">
                <span>✅</span>
              </div>
              <h3>View Tasks</h3>
              <p>Check your pending and completed tasks</p>
            </div>

            <div className="action-card" onClick={() => navigate('/teams')}>
              <div className="card-icon teams">
                <span>👥</span>
              </div>
              <h3>View Teams</h3>
              <p>Collaborate with your team members</p>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card active-projects">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Active Projects</h3>
                <div className="stat-number">5</div>
                <p className="stat-description">Projects in progress</p>
              </div>
            </div>

            <div className="stat-card pending-tasks">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>Pending Tasks</h3>
                <div className="stat-number">12</div>
                <p className="stat-description">Tasks awaiting completion</p>
              </div>
            </div>

            <div className="stat-card team-members">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Team Members</h3>
                <div className="stat-number">8</div>
                <p className="stat-description">Active collaborators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 