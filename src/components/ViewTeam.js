import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewTeam.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

function ViewTeam() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = () => {
    setIsLoading(true);
    // Get all teams from localStorage
    const allTeams = [];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('project_')) {
        const teams = JSON.parse(localStorage.getItem(key));
        allTeams.push(...teams);
      }
    });

    // Find the specific team
    const foundTeam = allTeams.find(t => t.id === teamId);
    if (foundTeam) {
      if (!foundTeam.members) {
        foundTeam.members = [];
      }
      setTeam(foundTeam);
    }
    setIsLoading(false);
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleManageMembers = () => {
    navigate(`/team/${teamId}/members`);
  };

  if (isLoading) {
    return (
      <div className={`view-team-page ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading team details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className={`view-team-page ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="not-found-container">
            <h2>Team Not Found</h2>
            <p>The team you're looking for doesn't exist.</p>
            <button onClick={() => navigate(-1)} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`view-team-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="team-container">
          {/* Team Header */}
          <div className="team-header">
            <div className="team-title">
              <h1>{team.name}</h1>
              <span className="member-count">{team.members.length} members</span>
            </div>
            <button onClick={handleManageMembers} className="manage-members-btn">
              Manage Members
            </button>
          </div>

          {/* Team Leader Section */}
          <div className="info-card team-leader-section">
            <div className="card-header">
              <h2>Team Leader</h2>
              <span className="leader-icon">👤</span>
            </div>
            {team.leader ? (
              <div className="leader-info">
                <div className="leader-name">{team.leader.name || 'Not specified'}</div>
                <div className="leader-email">{team.leader.email}</div>
              </div>
            ) : (
              <p className="no-leader">No team leader assigned</p>
            )}
          </div>

          {/* Team Members Section */}
          <div className="info-card team-members-section">
            <div className="card-header">
              <h2>Team Members</h2>
              <span className="members-icon">👥</span>
            </div>
            {team.members.length > 0 ? (
              <div className="members-grid">
                {team.members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-avatar">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">{member.name}</div>
                      <div className="member-email">{member.email}</div>
                      <div className="member-role">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-members">
                <p>No team members yet</p>
                <button onClick={handleManageMembers} className="add-members-btn">
                  Add Members
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTeam; 