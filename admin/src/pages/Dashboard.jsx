import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', color: '#2c5f8a' },
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#4a90e2' },
    { title: 'Total Appointments', value: stats.totalAppointments, icon: '📋', color: '#5a6c7e' },
    { title: 'Pending Appointments', value: stats.pendingAppointments, icon: '⏳', color: '#f39c12' },
    { title: 'Completed Appointments', value: stats.completedAppointments, icon: '✅', color: '#27ae60' },
    { title: 'Cancelled Appointments', value: stats.cancelledAppointments, icon: '❌', color: '#e74c3c' },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1>Dashboard Overview</h1>
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;