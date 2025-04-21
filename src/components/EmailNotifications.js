import React, { useState, useEffect } from 'react';
import './EmailNotifications.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

function EmailNotifications() {
  const { isDarkMode } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load emails from localStorage
    const storedEmails = localStorage.getItem('sent_emails');
    if (storedEmails) {
      setEmails(JSON.parse(storedEmails));
    }
    setLoading(false);
  }, []);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`email-notifications-page ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="email-notifications-container">
          <div className="section-header">
            <h2>Email Notifications</h2>
            <span className="section-icon gradient-purple">📧</span>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading notifications...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>No Email Notifications</h3>
              <p>No emails have been sent yet. Emails will appear here when team leaders are assigned.</p>
            </div>
          ) : (
            <div className="emails-list">
              {emails.map((email, index) => (
                <div key={index} className="email-card">
                  <div className="email-header">
                    <h3>{email.subject}</h3>
                    <span className="email-date">{formatDate(email.timestamp)}</span>
                  </div>
                  <div className="email-to">
                    <strong>To:</strong> {email.to}
                  </div>
                  <div className="email-body">
                    <pre>{email.body}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailNotifications; 