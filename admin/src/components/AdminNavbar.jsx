import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <h1>Welcome, {adminName}</h1>
        <div className="admin-profile">
          <div className="admin-avatar" onClick={() => setShowDropdown(!showDropdown)}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          {showDropdown && (
            <div className="admin-dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;