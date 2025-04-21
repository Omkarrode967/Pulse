import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamMembers.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { sendEmail } from '../services/emailService';

function TeamMembers() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [team, setTeam] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    startDate: '',
    endDate: '',
    workingHours: {
      start: '09:00',
      end: '17:00'
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = () => {
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
      // Initialize members array if it doesn't exist
      if (!foundTeam.members) {
        foundTeam.members = [];
      }
      setTeam(foundTeam);
    }
  };

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewMember(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewMember(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!team) return;

    // Validate inputs
    if (!newMember.name || !newMember.email || !newMember.role) {
      setError('Please fill in all fields');
      return;
    }

    // Check if email is same as team leader's
    if (newMember.email === team.leader?.email) {
      setError('This email is already assigned to the team leader');
      return;
    }

    // Check if email already exists in team members
    if (team.members.some(member => member.email === newMember.email)) {
      setError('A member with this email already exists in the team');
      return;
    }

    // Create new member object
    const member = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      startDate: newMember.startDate,
      endDate: newMember.endDate,
      workingHours: newMember.workingHours
    };

    // Update team in localStorage
    const updatedTeam = {
      ...team,
      members: [...team.members, member]
    };

    // Find and update the team in the correct project's teams
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('project_')) {
        const teams = JSON.parse(localStorage.getItem(key));
        const updatedTeams = teams.map(t => t.id === teamId ? updatedTeam : t);
        localStorage.setItem(key, JSON.stringify(updatedTeams));
      }
    });

    // Send email notification to the new member
    try {
      const templateData = {
        to_email: member.email,
        to_name: member.name,
        team_name: team.name,
        role: member.role,
        leader_name: team.leader?.name || 'Not specified',
        project_name: 'Project Management System'
      };

      const emailSent = await sendEmail(
        member.email,
        `Team Member Assignment - ${team.name}`,
        templateData,
        true
      );

      if (!emailSent) {
        console.warn('Email notification stored locally but not sent');
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Continue with the member addition even if email fails
    }

    // Update state
    setTeam(updatedTeam);
    setNewMember({
      name: '',
      email: '',
      role: '',
      startDate: '',
      endDate: '',
      workingHours: {
        start: '09:00',
        end: '17:00'
      }
    });
    setSuccess('Team member added successfully and notification email sent');
    setError('');
  };

  const handleRemoveMember = async (memberId) => {
    if (!team) return;

    if (window.confirm('Are you sure you want to remove this team member?')) {
      const memberToRemove = team.members.find(m => m.id === memberId);
      
      // Update team in localStorage
      const updatedTeam = {
        ...team,
        members: team.members.filter(m => m.id !== memberId)
      };

      // Find and update the team in the correct project's teams
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('project_')) {
          const teams = JSON.parse(localStorage.getItem(key));
          const updatedTeams = teams.map(t => t.id === teamId ? updatedTeam : t);
          localStorage.setItem(key, JSON.stringify(updatedTeams));
        }
      });

      // Send email notification to the removed member
      if (memberToRemove) {
        try {
          const emailBody = `Hello ${memberToRemove.name},\n\nThis is to inform you that you have been removed from the team "${team.name}".\n\nIf you believe this was done in error, please contact your team leader at ${team.leader?.email || 'Not specified'}.\n\nBest regards,\nProject Management System`;
          
          const emailSent = await sendEmail(
            memberToRemove.email,
            `Removed from ${team.name}`,
            emailBody
          );

          if (!emailSent) {
            console.warn('Email notification stored locally but not sent');
          }
        } catch (error) {
          console.error('Failed to send email notification:', error);
          // Continue with the member removal even if email fails
        }
      }

      // Update state
      setTeam(updatedTeam);
      setSuccess('Team member removed successfully and notification email sent');
    }
  };

  if (!team) {
    return (
      <div className={`team-members-page ${isDarkMode ? 'dark' : ''}`}>
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="not-found">
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
    <div className={`team-members-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="team-members-container">
          <div className="section-header">
            <h2>{team.name} - Team Members</h2>
            <span className="section-icon">👥</span>
          </div>

          <div className="team-leader-info">
            <h3>Team Leader</h3>
            {team.leader ? (
              <div className="leader-card">
                <div className="leader-details">
                  <span className="name">{team.leader.name || 'Not specified'}</span>
                  <span className="email">{team.leader.email}</span>
                </div>
              </div>
            ) : (
              <p>No team leader assigned</p>
            )}
          </div>

          <div className="add-member-section">
            <h3>Add New Member</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit} className="add-member-form">
              <div className="form-grid">
                {/* Basic Information */}
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    placeholder="Enter member name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    placeholder="Enter member email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                    placeholder="Enter member role"
                    required
                  />
                </div>

                {/* Timeline Settings */}
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={newMember.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={newMember.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Working Hours */}
                <div className="form-group">
                  <label>Working Hours</label>
                  <div className="working-hours">
                    <div className="time-input">
                      <input
                        type="time"
                        name="workingHours.start"
                        value={newMember.workingHours.start}
                        onChange={handleInputChange}
                        required
                      />
                      <span>to</span>
                      <input
                        type="time"
                        name="workingHours.end"
                        value={newMember.workingHours.end}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline Warning */}
              {newMember.startDate && newMember.endDate && (
                <div className="deadline-info">
                  <div className="timeline-visual">
                    <div className="timeline-bar">
                      <div 
                        className="timeline-progress"
                        style={{
                          width: `${calculateProgress(newMember.startDate, newMember.endDate)}%`
                        }}
                      ></div>
                    </div>
                    <div className="timeline-dates">
                      <span>{formatDate(newMember.startDate)}</span>
                      <span>{formatDate(newMember.endDate)}</span>
                    </div>
                  </div>
                  <p className="deadline-warning">
                    {calculateDeadlineWarning(newMember.startDate, newMember.endDate)}
                  </p>
                </div>
              )}

              <button type="submit" className="add-button">
                Add Member
              </button>
            </form>
          </div>

          <div className="team-members-list">
            <h3>Team Members ({team.members.length})</h3>
            {team.members.length > 0 ? (
              <div className="members-grid">
                {team.members.map((member) => (
                  <div key={member.id} className="member-card">
                    <div className="member-info">
                      <span className="name">{member.name}</span>
                      <span className="email">{member.email}</span>
                      <span className="role">{member.role}</span>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-members">
                <p>No team members yet. Add members using the form above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const calculateProgress = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  const total = end - start;
  const current = today - start;
  
  const progress = (current / total) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

const calculateDeadlineWarning = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  const daysTotal = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) {
    return '⚠️ Warning: Selected dates are in the past';
  } else if (daysLeft === 0) {
    return '⚠️ Deadline is today!';
  } else if (daysTotal < 7) {
    return '⚠️ Very short timeline (less than a week)';
  } else if (daysTotal > 90) {
    return 'ℹ️ Long-term assignment (over 3 months)';
  }
  return `📅 ${daysLeft} days until deadline`;
};

export default TeamMembers; 