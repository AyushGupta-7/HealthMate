import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import './AdminDoctors.css';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [newDoctor, setNewDoctor] = useState({
    name: '', email: '', password: 'Doctor@123', image: '', speciality: '',
    degree: 'MBBS', experience: '', about: '', fees: '', address: { line1: '', city: '', state: '' }
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      showMessage('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/admin/doctors', newDoctor);
      if (response.data.success) {
        showMessage('Doctor added successfully!', 'success');
        setShowAddModal(false);
        fetchDoctors();
        setNewDoctor({ name: '', email: '', password: 'Doctor@123', image: '', speciality: '', degree: 'MBBS', experience: '', about: '', fees: '', address: { line1: '', city: '', state: '' } });
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to add doctor', 'error');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await API.delete(`/admin/doctors/${id}`);
        showMessage('Doctor deleted successfully!', 'success');
        fetchDoctors();
      } catch (error) {
        showMessage('Failed to delete doctor', 'error');
      }
    }
  };

  const handleToggleAvailability = async (doctor) => {
    try {
      const response = await API.put(`/admin/doctors/${doctor._id}/availability`, {
        available: !doctor.available
      });
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        fetchDoctors();
      }
    } catch (error) {
      showMessage('Failed to update availability', 'error');
    }
  };

  const handleUpdateSlotAvailability = async (doctorId, date, slots, isAvailable) => {
    try {
      const response = await API.put(`/admin/doctors/${doctorId}/slots`, {
        date, slots, isAvailable
      });
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        setShowAvailabilityModal(null);
        fetchDoctors();
      }
    } catch (error) {
      showMessage('Failed to update slot availability', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const specialties = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'];
  const timeSlots = ["10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

  if (loading) return <AdminLayout><div className="loading-spinner">Loading doctors...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-doctors">
        <div className="page-header">
          <div className="header-left"><h2>Manage Doctors</h2><p>Add, edit, or remove doctors from the system</p></div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add New Doctor</button>
        </div>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <div className="doctors-table-wrapper">
          <table className="doctors-table">
            <thead><tr><th>Doctor</th><th>Speciality</th><th>Experience</th><th>Fee</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor._id}>
                  <td><div className="doctor-cell"><img src={doctor.image} alt={doctor.name} /><span>{doctor.name}</span></div></td>
                  <td>{doctor.speciality}</td><td>{doctor.experience}</td><td>₹{doctor.fees}</td>
                  <td><span className={`status-badge ${doctor.available ? 'available' : 'unavailable'}`}>{doctor.available ? 'Available' : 'Unavailable'}</span></td>
                  <td>
                    <button className="action-btn availability" onClick={() => handleToggleAvailability(doctor)}>Toggle Availability</button>
                    <button className="action-btn slots" onClick={() => setShowAvailabilityModal(doctor)}>📅 Set Slots</button>
                    <button className="action-btn delete" onClick={() => handleDeleteDoctor(doctor._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Doctor Modal */}
        {showAddModal && <div className="modal-overlay" onClick={() => setShowAddModal(false)}><div className="modal-content" onClick={e => e.stopPropagation()}><h2>Add New Doctor</h2><form onSubmit={handleAddDoctor}><input type="text" placeholder="Doctor Name" value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} required /><input type="email" placeholder="Email" value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} required /><input type="text" placeholder="Image URL" value={newDoctor.image} onChange={e => setNewDoctor({ ...newDoctor, image: e.target.value })} required /><select value={newDoctor.speciality} onChange={e => setNewDoctor({ ...newDoctor, speciality: e.target.value })} required><option value="">Select Speciality</option>{specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}</select><input type="text" placeholder="Degree" value={newDoctor.degree} onChange={e => setNewDoctor({ ...newDoctor, degree: e.target.value })} /><input type="text" placeholder="Experience" value={newDoctor.experience} onChange={e => setNewDoctor({ ...newDoctor, experience: e.target.value })} required /><textarea placeholder="About Doctor" value={newDoctor.about} onChange={e => setNewDoctor({ ...newDoctor, about: e.target.value })} required /><input type="number" placeholder="Fee" value={newDoctor.fees} onChange={e => setNewDoctor({ ...newDoctor, fees: e.target.value })} required /><input type="text" placeholder="Address Line 1" value={newDoctor.address.line1} onChange={e => setNewDoctor({ ...newDoctor, address: { ...newDoctor.address, line1: e.target.value } })} /><input type="text" placeholder="City" value={newDoctor.address.city} onChange={e => setNewDoctor({ ...newDoctor, address: { ...newDoctor.address, city: e.target.value } })} /><input type="text" placeholder="State" value={newDoctor.address.state} onChange={e => setNewDoctor({ ...newDoctor, address: { ...newDoctor.address, state: e.target.value } })} /><div className="modal-buttons"><button type="submit">Add Doctor</button><button type="button" onClick={() => setShowAddModal(false)}>Cancel</button></div></form></div></div>}

        {/* Set Slot Availability Modal */}
        {showAvailabilityModal && (
          <div className="modal-overlay" onClick={() => setShowAvailabilityModal(null)}>
            <div className="modal-content availability-modal" onClick={e => e.stopPropagation()}>
              <h2>Set Slot Availability for {showAvailabilityModal.name}</h2>
              <div className="availability-form">
                <div className="form-group"><label>Select Date</label><input type="date" id="slotDate" /></div>
                <div className="form-group"><label>Mark as Unavailable</label><div className="time-slots-grid">{timeSlots.map(slot => (<label key={slot} className="slot-checkbox"><input type="checkbox" value={slot} />{slot}</label>))}</div></div>
                <div className="form-group"><label>Mark as Available</label><div className="time-slots-grid time-slots-available">{timeSlots.map(slot => (<label key={slot} className="slot-checkbox"><input type="checkbox" value={slot} className="available-slot" />{slot}</label>))}</div></div>
                <div className="modal-buttons"><button onClick={() => { const date = document.getElementById('slotDate').value; const unavailableSlots = Array.from(document.querySelectorAll('.time-slots-grid:first-child .slot-checkbox input:checked')).map(cb => cb.value); const availableSlots = Array.from(document.querySelectorAll('.time-slots-available .slot-checkbox input:checked')).map(cb => cb.value); if (unavailableSlots.length > 0) handleUpdateSlotAvailability(showAvailabilityModal._id, date, unavailableSlots, false); if (availableSlots.length > 0) handleUpdateSlotAvailability(showAvailabilityModal._id, date, availableSlots, true); if (unavailableSlots.length === 0 && availableSlots.length === 0) alert('Select at least one slot'); }}>Update Slots</button><button onClick={() => setShowAvailabilityModal(null)}>Cancel</button></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDoctors;