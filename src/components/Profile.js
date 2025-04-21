import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email)}&background=4f46e5&color=fff`}
            alt="Profile" 
            className="profile-image"
          />
        </div>
        <div className="profile-info">
          <h1>{user?.displayName || 'No Name Set'}</h1>
          <p className="profile-email">{user?.email}</p>
          <span className="profile-role">Team Member</span>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Display Name</label>
              <p>{user?.displayName || 'Not set'}</p>
            </div>
            <div className="info-item">
              <label>Account Created</label>
              <p>{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Last Sign In</label>
              <p>{user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Preferences</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email Notifications</label>
              <p>Enabled</p>
            </div>
            <div className="info-item">
              <label>Time Zone</label>
              <p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 