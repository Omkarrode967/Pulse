import React, { useState, useEffect } from 'react';
import './Teams.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

function Teams() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    try {
      const allTeams = [];
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      // Debug information
      const debugData = {
        currentUser: currentUser,
        localStorage: {},
        foundTeams: []
      };

      if (!currentUser) {
        console.error('No current user found in localStorage');
        setError('User not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      console.log('Current user:', currentUser);
      
      // Get all project teams
      const projectKeys = Object.keys(localStorage).filter(key => key.includes('_teams'));
      console.log('Found project team keys:', projectKeys);

      projectKeys.forEach(projectKey => {
        try {
          const teamsData = localStorage.getItem(projectKey);
          debugData.localStorage[projectKey] = teamsData;
          
          console.log(`Raw teams data for ${projectKey}:`, teamsData);
          
          const teams = JSON.parse(teamsData);
          console.log(`Parsed teams data for ${projectKey}:`, teams);

          if (!Array.isArray(teams)) {
            console.log(`Teams data for ${projectKey} is not an array`);
            return;
          }

          teams.forEach(team => {
            console.log(`Checking team:`, team);
            console.log('Team leader:', team.leader);
            console.log('Team members:', team.members);
            console.log('Current user email:', currentUser.email);

            // Check if user is leader or member
            const isLeader = team.leader && team.leader.email === currentUser.email;
            const isMember = team.members && Array.isArray(team.members) && 
                           team.members.some(member => member.email === currentUser.email);

            console.log(`Team ${team.name} - isLeader: ${isLeader}, isMember: ${isMember}`);

            if (isLeader || isMember) {
              // Get project ID from the key (e.g., "project_1_teams" -> "1")
              const projectId = projectKey.split('_')[1];
              
              const teamWithProject = {
                ...team,
                projectId: projectId,
                projectName: `Project ${projectId}`,
                role: isLeader ? 'Team Leader' : 'Team Member'
              };
              allTeams.push(teamWithProject);
              debugData.foundTeams.push(teamWithProject);
            }
          });
        } catch (err) {
          console.error(`Error processing project ${projectKey}:`, err);
        }
      });

      console.log('Final teams array:', allTeams);
      setDebugInfo(debugData);
      setTeams(allTeams);
      setIsLoading(false);

    } catch (err) {
      console.error('Error in fetchTeams:', err);
      setError('Failed to load teams. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleTeamClick = (teamId, projectId) => {
    navigate(`/projects/${projectId}/teams/${teamId}`);
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
              <p>
                {debugInfo && (
                  <div className="debug-info">
                    <p><strong>Current User:</strong> {debugInfo.currentUser?.email}</p>
                    <p><strong>Projects Found:</strong> {Object.keys(debugInfo.localStorage).length}</p>
                    <p><strong>Teams Found:</strong> {debugInfo.foundTeams.length}</p>
                    <details>
                      <summary>Debug Details</summary>
                      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                    </details>
                  </div>
                )}
              </p>
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