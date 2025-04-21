import React, { useState } from 'react';
import './Home.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';

function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('project-', '')]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      console.log('Submitting project data:', formData);
      const response = await projectService.createProject(formData);
      console.log('Project created successfully:', response);
      setSuccessMessage('Project created successfully!');
      
      // Navigate to team creation page after a short delay
      setTimeout(() => {
        navigate('/create-team', { 
          state: { projectId: response.id }
        });
      }, 1500);

      setFormData({
        name: '',
        description: ''
      });
    } catch (err) {
      console.error('Detailed error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create project. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`home-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="home-container">
          <div className="welcome-section">
            <div className="welcome-icon">🌟</div>
            <h1>Welcome to Pulse</h1>
            <p className="welcome-subtitle">Your all-in-one project management solution</p>
          </div>
          
          <div className="create-project-section">
            <div className="section-header">
              <h2>Create New Project</h2>
              <span className="section-icon gradient-purple">⚡</span>
            </div>
            <div className="create-project-card">
              <form onSubmit={handleSubmit} className="create-project-form">
                <div className="form-group">
                  <label htmlFor="project-name">Project Name</label>
                  <input 
                    type="text" 
                    id="project-name" 
                    placeholder="Enter project name" 
                    className="project-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project-description">Project Description</label>
                  <textarea 
                    id="project-description" 
                    placeholder="Describe your project" 
                    className="project-textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                {error && (
                  <div className="error-message">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                {successMessage && (
                  <div className="success-message">
                    <strong>Success:</strong> {successMessage}
                  </div>
                )}
                <button 
                  className="create-button" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Access</h2>
              <span className="section-icon gradient-blue">💫</span>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card gradient-card-blue">
                <div className="card-icon">
                  <span className="icon-wrapper blue">📊</span>
                </div>
                <h2>My Projects</h2>
                <p>View and manage your projects</p>
                <div className="card-footer">
                  <span className="card-count">
                    <span className="count-icon">🎯</span>
                    5 Active
                  </span>
                  <button className="card-action" onClick={() => navigate('/projects')}>View All</button>
                </div>
              </div>
              <div className="dashboard-card gradient-card-purple">
                <div className="card-icon">
                  <span className="icon-wrapper purple">👥</span>
                </div>
                <h2>My Teams</h2>
                <p>Collaborate with your teams</p>
                <div className="card-footer">
                  <span className="card-count">
                    <span className="count-icon">👥</span>
                    3 Teams
                  </span>
                  <button className="card-action">View All</button>
                </div>
              </div>
              <div className="dashboard-card gradient-card-green">
                <div className="card-icon">
                  <span className="icon-wrapper green">✅</span>
                </div>
                <h2>My Tasks</h2>
                <p>Track your daily tasks</p>
                <div className="card-footer">
                  <span className="card-count">
                    <span className="count-icon">📝</span>
                    12 Pending
                  </span>
                  <button className="card-action">View All</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 