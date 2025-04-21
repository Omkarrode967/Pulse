import React, { useState } from 'react';
import './Team.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendTeamLeaderNotification, isEmailJSConfigured } from '../services/emailService';

function Team() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = location.state?.projectId;

  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    setEmailStatus('');

    try {
      // Create team object
      const newTeam = {
        id: Date.now().toString(),
        name: teamName,
        leader: {
          name: leaderName,
          email: leaderEmail
        },
        members: [],
        projectId
      };

      // Store team in localStorage with project-specific key
      const storageKey = `project_${projectId}_teams`;
      const teams = JSON.parse(localStorage.getItem(storageKey) || '[]');
      teams.push(newTeam);
      localStorage.setItem(storageKey, JSON.stringify(teams));

      // Send email notification to team leader
      setEmailStatus('sending');
      const emailSent = await sendTeamLeaderNotification(teamName, leaderName, leaderEmail);
      
      if (emailSent) {
        setEmailStatus('sent');
        setSuccessMessage('Team created successfully and team leader has been notified via email.');
      } else {
        setEmailStatus('stored');
        setSuccessMessage('Team created successfully. Email notification was stored but not sent (EmailJS not configured).');
      }

      // Navigate back to project details
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);

    } catch (err) {
      setError('Failed to create team. Please try again.');
      setEmailStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEmailStatus = () => {
    if (!emailStatus) return null;

    switch (emailStatus) {
      case 'sending':
        return <div className="info-message">Sending email notification to team leader...</div>;
      case 'sent':
        return <div className="success-message">Email notification sent successfully!</div>;
      case 'stored':
        return (
          <div className="warning-message">
            Email notification was stored but not sent. To enable email notifications, please configure EmailJS.
            <button 
              className="configure-email-button"
              onClick={() => navigate('/email-setup')}
            >
              Configure Email
            </button>
          </div>
        );
      case 'failed':
        return <div className="error-message">Failed to send email notification. Please try again.</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`team-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="team-container">
          <div className="section-header">
            <h2>Create Team for Your Project</h2>
            <span className="section-icon gradient-purple">👥</span>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {renderEmailStatus()}

          <form onSubmit={handleSubmit} className="team-form">
            <div className="form-group">
              <label htmlFor="teamName">Team Name</label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leaderName">Team Leader Name</label>
              <input
                type="text"
                id="leaderName"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leaderEmail">Team Leader Email</label>
              <input
                type="email"
                id="leaderEmail"
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Team...' : 'Create Team'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Team; 