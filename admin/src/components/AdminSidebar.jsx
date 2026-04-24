import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/doctors', icon: '👨‍⚕️', label: 'Manage Doctors' },
    { path: '/admin/availability', icon: '📅', label: 'Set Availability' },
    { path: '/admin/users', icon: '👥', label: 'Manage Users' },
    { path: '/admin/appointments', icon: '📋', label: 'All Appointments' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>HealthMate</h2>
        <p>Admin Panel</p>
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            <span className="admin-nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;