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
        <div className="dashboard-container">
          <div className="loading">Loading dashboard data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="dashboard-container">
          <div className="error">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h1>Welcome, {adminName}! 👋</h1>
        <p className="welcome-text">
          Welcome to the HealthMate Admin Dashboard. Here's your overview.
        </p>
        
        <div className="stats-grid-admin">
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-info-admin">
              <h3>Total Doctors</h3>
              <p>{stats.totalDoctors}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info-admin">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info-admin">
              <h3>Total Appointments</h3>
              <p>{stats.totalAppointments}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info-admin">
              <h3>Pending</h3>
              <p>{stats.pendingAppointments}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info-admin">
              <h3>Completed</h3>
              <p>{stats.completedAppointments}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-info-admin">
              <h3>Cancelled</h3>
              <p>{stats.cancelledAppointments}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;