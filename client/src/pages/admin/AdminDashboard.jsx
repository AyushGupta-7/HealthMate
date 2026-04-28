import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    
    console.log('AdminDashboard - userRole:', userRole);
    console.log('AdminDashboard - token exists:', !!token);
    
    if (userRole !== 'admin') {
      console.log('Not admin, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    
    if (!token) {
      console.log('No token, redirecting to login');
      navigate('/login');
      return;
    }
    
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/admin/stats');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to load statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  const adminName = localStorage.getItem('userName') || 'Admin';

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-dashboard-container">
          <div className="admin-dashboard-loading">Loading dashboard data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-dashboard-container">
          <div className="admin-dashboard-error">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">Welcome, {adminName}! 👋</h1>
        <p className="admin-dashboard-welcome-text">
          Welcome to the HealthMate Admin Dashboard. Here's your overview.
        </p>
        
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👨‍⚕️</div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-label">Total Doctors</h3>
              <p className="admin-stat-value">{stats.totalDoctors}</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👥</div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-label">Total Users</h3>
              <p className="admin-stat-value">{stats.totalUsers}</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📋</div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-label">Total Appointments</h3>
              <p className="admin-stat-value">{stats.totalAppointments}</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">⏳</div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-label">Pending</h3>
              <p className="admin-stat-value">{stats.pendingAppointments}</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-label">Completed</h3>
              <p className="admin-stat-value">{stats.completedAppointments}</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">❌</div>
            <div className="admin-stat-info">
              <h3 className="admin-stat-label">Cancelled</h3>
              <p className="admin-stat-value">{stats.cancelledAppointments}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;