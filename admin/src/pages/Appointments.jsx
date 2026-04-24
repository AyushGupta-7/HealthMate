import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../services/api';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await API.get('/admin/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'paid': return 'status-paid';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <AdminLayout>
      <div className="appointments-management">
        <h1>All Appointments</h1>
        
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Date</th>
                <th>Time</th>
                <th>Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt._id}>
                  <td>{apt.user?.fullName || 'N/A'}</td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.doctorSpecialty}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>₹{apt.fee}</td>
                  <td><span className={`status-badge ${getStatusClass(apt.status)}`}>{apt.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Appointments;