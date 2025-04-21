import React, { useState, useEffect } from 'react';
import './Projects.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';

function Projects() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again later.');
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/home');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'on_hold':
        return 'status-on-hold';
      default:
        return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`projects-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="projects-container">
          <div className="section-header">
            <h2>My Projects</h2>
            <span className="section-icon gradient-blue">📊</span>
            <button onClick={handleCreateProject} className="create-new-button">
              Create New Project
            </button>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button onClick={fetchProjects} className="retry-button">
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>No Projects Yet</h3>
              <p>Create your first project to get started!</p>
              <button onClick={handleCreateProject} className="create-project-button">
                Create Project
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span className={`status-badge ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span className="meta-label">Start Date:</span>
                      <span className="meta-value">{formatDate(project.startDate)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">👥</span>
                      <span className="meta-label">Team Size:</span>
                      <span className="meta-value">{project.teamSize || 0} members</span>
                    </div>
                  </div>
                  <div className="project-footer">
                    <button 
                      className="view-details-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}
                    >
                      View Details
                    </button>
                    <button 
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(project.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === project.id && (
                    <div className="delete-confirm-modal">
                      <div className="delete-confirm-content">
                        <h4>Delete Project?</h4>
                        <p>Are you sure you want to delete "{project.name}"? This action cannot be undone.</p>
                        <div className="delete-confirm-buttons">
                          <button 
                            className="cancel-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button 
                            className="confirm-delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                          >
                            Delete Project
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects; 