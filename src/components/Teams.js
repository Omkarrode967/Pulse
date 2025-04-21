import React, { useState, useEffect } from 'react';
import './Teams.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';

function Teams() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        setError('User not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      const allTeams = [];
      const projectKeys = Object.keys(localStorage).filter(key => key.includes('_teams'));
      const projectsData = await projectService.getAllProjects();
      const projectsMap = new Map(projectsData.map(p => [p.id.toString(), p]));

      projectKeys.forEach(projectKey => {
        try {
          const teamsData = JSON.parse(localStorage.getItem(projectKey));
          if (!Array.isArray(teamsData)) return;

          teamsData.forEach(team => {
            const isLeader = team.leader?.email === currentUser.email;
            const isMember = team.members?.some(member => member.email === currentUser.email);

            if (isLeader || isMember) {
              const projectId = projectKey.split('_')[1];
              const project = projectsMap.get(projectId);
              
              const teamWithDetails = {
                ...team,
                projectId,
                projectName: project ? project.name : `Project ${projectId}`,
                projectDescription: project ? project.description : '',
                role: isLeader ? 'Team Leader' : 'Team Member',
                status: project ? project.status : 'ACTIVE'
              };
              allTeams.push(teamWithDetails);
            }
          });
        } catch (err) {
          console.error(`Error processing project ${projectKey}:`, err);
        }
      });

      setTeams(allTeams);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again.');
      setIsLoading(false);
    }
  };

  const handleTeamClick = (teamId, projectId) => {
    navigate(`/projects/${projectId}/team/${teamId}`);
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-badge-active';
      case 'completed':
        return 'status-badge-completed';
      case 'on_hold':
        return 'status-badge-hold';
      default:
        return 'status-badge-default';
    }
  };

  return (
    <div className={`teams-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="teams-container">
          <div className="section-header">
            <h2>My Teams</h2>
            <span className="section-icon">👥</span>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading teams...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button onClick={fetchTeams} className="retry-button">
                Try Again
              </button>
            </div>
          ) : teams.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👥</span>
              <h3>No Teams Found</h3>
              <p>You are not a member of any teams yet.</p>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="team-card"
                  onClick={() => handleTeamClick(team.id, team.projectId)}
                >
                  <div className="team-header">
                    <h3>{team.name}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(team.status)}`}>
                      {team.status}
                    </span>
                  </div>
                  <div className="team-info">
                    <div className="info-item">
                      <span className="label">Project:</span>
                      <span className="value">{team.projectName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Role:</span>
                      <span className="value">{team.role}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Members:</span>
                      <span className="value">{team.members?.length || 0}</span>
                    </div>
                  </div>
                  <div className="team-description">
                    {team.projectDescription || 'No project description available.'}
                  </div>
                  <button className="view-details-button">View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teams; 