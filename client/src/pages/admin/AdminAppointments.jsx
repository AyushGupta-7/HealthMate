import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminAppointments.css';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const sampleAppointments = [
      { id: 1, patient: 'John Doe', doctor: 'Dr. Princy Singh', date: '2024-04-15', time: '10:30 AM', fee: 500, status: 'pending' },
      { id: 2, patient: 'Jane Smith', doctor: 'Dr. Ramit Sambhoyal', date: '2024-04-16', time: '2:00 PM', fee: 400, status: 'completed' },
      { id: 3, patient: 'Mike Johnson', doctor: 'Dr. Sanjay Barude', date: '2024-04-17', time: '11:00 AM', fee: 600, status: 'cancelled' },
    ];
    setAppointments(sampleAppointments);
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) || apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    const classes = { pending: 'status-pending', completed: 'status-completed', cancelled: 'status-cancelled' };
    return classes[status] || '';
  };

  return (
    <AdminLayout>
      <div className="admin-appointments">
        <div className="page-header">
          <div className="header-left"><h2>All Appointments</h2><p>View and manage all appointments</p></div>
        </div>

        <div className="filters-section">
          <div className="filter-buttons">
            {['all', 'pending', 'completed', 'cancelled'].map(f => (
              <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="search-section"><input type="text" placeholder="🔍 Search by patient or doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>

        <div className="appointments-table-wrapper">
          <table className="appointments-table">
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Fee</th><th>Status</th></tr></thead>
            <tbody>
              {filteredAppointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patient}</td><td>{apt.doctor}</td><td>{apt.date}</td><td>{apt.time}</td><td>₹{apt.fee}</td>
                  <td><span className={`status-badge ${getStatusClass(apt.status)}`}>{apt.status}</span></td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && <tr><td colSpan="6" className="no-data">No appointments found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;