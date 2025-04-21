import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamDetails.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

function TeamDetails() {
  const { projectId, teamId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [team, setTeam] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangingLeader, setIsChangingLeader] = useState(false);
  const [newLeader, setNewLeader] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchTeamDetails();
  }, [projectId, teamId]);

  const fetchTeamDetails = () => {
    try {
      const storedTeams = localStorage.getItem(`project_${projectId}_teams`);
      if (storedTeams) {
        const teams = JSON.parse(storedTeams);
        const foundTeam = teams.find(t => t.id === parseInt(teamId));
        if (foundTeam) {
          setTeam(foundTeam);
        } else {
          setError('Team not found');
        }
      } else {
        setError('No teams found for this project');
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching team details:', err);
      setError('Failed to load team details');
      setIsLoading(false);
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const updatedTeam = {
      ...team,
      members: [
        ...(team.members || []),
        {
          id: Date.now(),
          name: newMember.name,
          email: newMember.email
        }
      ]
    };

    // Update team in localStorage
    const storedTeams = localStorage.getItem(`project_${projectId}_teams`);
    if (storedTeams) {
      const teams = JSON.parse(storedTeams);
      const updatedTeams = teams.map(t => 
        t.id === team.id ? updatedTeam : t
      );
      localStorage.setItem(`project_${projectId}_teams`, JSON.stringify(updatedTeams));
      setTeam(updatedTeam);
      setNewMember({ name: '', email: '' });
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleChangeLeader = (e) => {
    e.preventDefault();
    if (!newLeader.name || !newLeader.email) return;

    const updatedTeam = {
      ...team,
      teamLead: {
        name: newLeader.name,
        email: newLeader.email,
        isCreator: false
      }
    };

    // Update team in localStorage
    const storedTeams = localStorage.getItem(`project_${projectId}_teams`);
    if (storedTeams) {
      const teams = JSON.parse(storedTeams);
      const updatedTeams = teams.map(t => 
        t.id === team.id ? updatedTeam : t
      );
      localStorage.setItem(`project_${projectId}_teams`, JSON.stringify(updatedTeams));
      setTeam(updatedTeam);
      setNewLeader({ name: '', email: '' });
      setIsChangingLeader(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`team-details-page ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading team details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`team-details-page ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={() => navigate(`/projects/${projectId}`)} className="back-button">
              Back to Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`team-details-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="team-details-container">
          <div className="team-info-section">
            <div className="team-header">
              <h1>{team.name}</h1>
              <button onClick={() => navigate(`/projects/${projectId}`)} className="back-button">
                Back to Project
              </button>
            </div>
            <div className="team-meta">
              <p className="team-description">{team.description}</p>
              <div className="team-lead-section">
                <div className="team-lead">
                  <span className="label">Team Lead:</span>
                  <span className="value">
                    {team.teamLead?.name} ({team.teamLead?.email})
                    {team.teamLead?.isCreator && <span className="creator-badge">Creator</span>}
                  </span>
                </div>
                {!team.teamLead?.isCreator && (
                  <button 
                    onClick={() => setIsChangingLeader(!isChangingLeader)} 
                    className="change-leader-button"
                  >
                    Change Team Leader
                  </button>
                )}
              </div>
              
              {isChangingLeader && (
                <form onSubmit={handleChangeLeader} className="change-leader-form">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="New Leader Name"
                      value={newLeader.name}
                      onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="New Leader Email"
                      value={newLeader.email}
                      onChange={(e) => setNewLeader({ ...newLeader, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-leader-button">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsChangingLeader(false);
                        setNewLeader({ name: '', email: '' });
                      }}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="add-member-section">
            <h2>Add Team Member</h2>
            <form onSubmit={handleAddMember} className="add-member-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Member Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="add-member-button">
                Add Member
              </button>
            </form>
          </div>

          <div className="members-section">
            <h2>Team Members</h2>
            {team.members && team.members.length > 0 ? (
              <div className="members-list">
                {team.members.map(member => (
                  <div key={member.id} className="member-card">
                    <div className="member-info">
                      <h3>{member.name}</h3>
                      <p>{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-members">
                <span className="empty-icon">👥</span>
                <p>No team members yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamDetails; 