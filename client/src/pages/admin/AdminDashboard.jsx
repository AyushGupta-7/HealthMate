import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    revenue: 0,
    recentAppointments: [],
    recentUsers: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setStats({
      totalDoctors: 24,
      totalUsers: 187,
      totalAppointments: 342,
      pendingAppointments: 23,
      completedAppointments: 289,
      cancelledAppointments: 30,
      revenue: 125000,
      recentAppointments: [
        { id: 1, patient: 'John Doe', doctor: 'Dr. Princy Singh', date: '2024-04-15', time: '10:30 AM', status: 'pending' },
        { id: 2, patient: 'Jane Smith', doctor: 'Dr. Ramit Sambhoyal', date: '2024-04-16', time: '2:00 PM', status: 'completed' },
      ],
      recentUsers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2024-04-10' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2024-04-09' },
      ]
    });
  };

  const statCards = [
    { icon: '👨‍⚕️', title: 'Total Doctors', value: stats.totalDoctors, color: '#4a90e2', bg: '#e8f0fe' },
    { icon: '👥', title: 'Total Users', value: stats.totalUsers, color: '#27ae60', bg: '#e8f5e9' },
    { icon: '📋', title: 'Appointments', value: stats.totalAppointments, color: '#8e44ad', bg: '#f3e5f5' },
    { icon: '💰', title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, color: '#e67e22', bg: '#fff3e0' },
  ];

  const appointmentStats = [
    { label: 'Pending', value: stats.pendingAppointments, color: '#e67e22', bg: '#fff3e0' },
    { label: 'Completed', value: stats.completedAppointments, color: '#27ae60', bg: '#e8f5e9' },
    { label: 'Cancelled', value: stats.cancelledAppointments, color: '#e74c3c', bg: '#ffebee' },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard-container">
        {/* Stats Grid */}
        <div className="admin-dashboard-stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="admin-dashboard-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="admin-dashboard-stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="admin-dashboard-stat-info">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Appointment Status */}
        <div className="admin-dashboard-appointment-status">
          <h2>Appointment Status</h2>
          <div className="admin-dashboard-status-grid">
            {appointmentStats.map((stat, index) => (
              <div key={index} className="admin-dashboard-status-card" style={{ backgroundColor: stat.bg }}>
                <div className="admin-dashboard-status-label">{stat.label}</div>
                <div className="admin-dashboard-status-value" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-dashboard-recent-activity">
          <div className="admin-dashboard-recent-card">
            <h3>Recent Appointments</h3>
            <table className="admin-dashboard-data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td>{apt.patient}</td>
                    <td>{apt.doctor}</td>
                    <td>{apt.date}</td>
                    <td className={`admin-dashboard-status-${apt.status}`}>{apt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-dashboard-recent-card">
            <h3>Recent Users</h3>
            <table className="admin-dashboard-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;