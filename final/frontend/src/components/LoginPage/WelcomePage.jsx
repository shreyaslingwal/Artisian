import React from 'react';
import { Shield } from 'lucide-react';
import '../../styles/components/WelcomePage.css';

const WelcomePage = ({ user, userRole }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          <Shield className="shield-icon-welcome" />
        </div>
        <h1 className="welcome-title">Welcome!</h1>
        <p className="welcome-subtitle">
          You have successfully logged in as a <span className="role-highlight">{userRole}</span>
        </p>
        <div className="user-details">
          <p className="details-title">User Details:</p>
          <div className="details-content">
            <p className="detail-item">Phone: {user?.phone}</p>
            <p className="detail-item">Role: {userRole}</p>
            <p className="detail-item">User ID: {user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;