import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import API from '../services/api';  // ← IMPORT THIS
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchPendingContactsCount();
    
    // Refresh pending count every 30 seconds
    const interval = setInterval(fetchPendingContactsCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingContactsCount = async () => {
    try {
      // Make sure API is defined
      if (!API) {
        console.error('API not initialized');
        return;
      }
      
      const response = await API.get('/contact/all');
      if (response.data && response.data.success) {
        const pending = response.data.contacts.filter(c => c.status === 'pending').length;
        setPendingCount(pending);
      }
    } catch (error) {
      console.error('Error fetching pending contacts:', error);
      // Don't show error to user, just log it
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/doctors', label: 'Manage Doctors', icon: '👨‍⚕️' },
    { path: '/admin/availability', label: 'Set Availability', icon: '📅' },
    { path: '/admin/contacts', label: 'Contact Inquiries', icon: '📬', badge: pendingCount > 0 ? pendingCount : null },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>HealthMate</h2>
          <p>Admin Panel</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badge > 0 ? 'has-pending' : ''}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;