import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'Admin';

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', color: '#4a90e2' },
    { path: '/admin/doctors', icon: '👨‍⚕️', label: 'Manage Doctors', color: '#27ae60' },
    { path: '/admin/users', icon: '👥', label: 'Manage Users', color: '#8e44ad' },
    { path: '/admin/appointments', icon: '📋', label: 'Appointments', color: '#e67e22' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <h2>HealthMate</h2>
          </div>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>

        <div className="admin-info">
          <div className="admin-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="admin-details">
            <h4>{userName}</h4>
            <p>Administrator</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              style={{ '--nav-color': item.color }}
            >
              <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
              {isActive(item.path) && <span className="active-indicator"></span>}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>{menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}</h1>
          <div className="topbar-right">
            <span className="welcome-text">Welcome, {userName}</span>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;