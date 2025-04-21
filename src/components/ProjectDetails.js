import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import projectService from '../services/projectService';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [project, setProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
    fetchTeams();
  }, [fetchProjectDetails, fetchTeams]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectService.getProjectById(id);
      setProject(response);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details. Please try again later.');
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      // Get teams from localStorage for this project
      const storedTeams = localStorage.getItem(`project_${id}_teams`);
      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
      } else {
        setTeams([]);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleCreateTeam = () => {
    navigate('/create-team', { state: { projectId: id } });
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      // Get existing teams from localStorage
      const storedTeams = localStorage.getItem(`project_${id}_teams`);
      if (storedTeams) {
        const existingTeams = JSON.parse(storedTeams);
        // Filter out the team to delete
        const updatedTeams = existingTeams.filter(team => team.id !== teamId);
        // Save the updated teams back to localStorage
        localStorage.setItem(`project_${id}_teams`, JSON.stringify(updatedTeams));
        // Update the state to reflect the change
        setTeams(updatedTeams);
      }
    }
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
    <div className={`project-details-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="project-details-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading project details...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button onClick={fetchProjectDetails} className="retry-button">
                Try Again
              </button>
            </div>
          ) : project ? (
            <>
              <div className="project-header">
                <div className="header-content">
                  <h1>{project.name}</h1>
                  <span className={`status-badge ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <button onClick={handleCreateTeam} className="create-team-button">
                  Create New Team
                </button>
              </div>

              <div className="project-info-grid">
                <div className="info-card">
                  <h3>Description</h3>
                  <p>{project.description}</p>
                </div>

                <div className="info-card">
                  <h3>Timeline</h3>
                  <div className="timeline-info">
                    <div className="timeline-item">
                      <span className="label">Start Date:</span>
                      <span className="value">{formatDate(project.startDate)}</span>
                    </div>
                    <div className="timeline-item">
                      <span className="label">End Date:</span>
                      <span className="value">{formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Project Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">{teams.length}</span>
                      <span className="stat-label">Teams</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Tasks</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0%</span>
                      <span className="stat-label">Progress</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="teams-section">
                <div className="section-header">
                  <h2>Teams</h2>
                  <button onClick={handleCreateTeam} className="add-team-button">
                    Add Team
                  </button>
                </div>

                {teams.length === 0 ? (
                  <div className="empty-teams">
                    <span className="empty-icon">👥</span>
                    <h3>No Teams Yet</h3>
                    <p>Create a team to start collaborating on this project.</p>
                    <button onClick={handleCreateTeam} className="create-team-button">
                      Create Team
                    </button>
                  </div>
                ) : (
                  <div className="teams-grid">
                    {teams.map((team) => (
                      <div key={team.id} className="team-card">
                        <div className="team-header">
                          <h3>{team.name}</h3>
                          <span className="team-members">{team.members?.length || 0} members</span>
                        </div>
                        <div className="team-info">
                          <div className="team-lead">
                            <span className="label">Team Leader:</span>
                            <span className="value">{team.leader?.name || 'Not assigned'}</span>
                          </div>
                          <div className="team-lead-email">
                            <span className="label">Leader Email:</span>
                            <span className="value">{team.leader?.email || 'Not assigned'}</span>
                          </div>
                        </div>
                        <div className="team-actions">
                          <button 
                            className="view-team-button"
                            onClick={() => navigate(`/team/${team.id}`)}
                          >
                            View Team
                          </button>
                          <button 
                            className="manage-members-button"
                            onClick={() => navigate(`/team/${team.id}/members`)}
                          >
                            Manage Members
                          </button>
                          <button 
                            className="delete-team-button"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            Delete Team
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>Project Not Found</h3>
              <p>The project you're looking for doesn't exist or has been deleted.</p>
              <button onClick={() => navigate('/projects')} className="back-button">
                Back to Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails; 