import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import './AdminDoctors.css';

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Doctor@123',
    image: '',
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '', city: '', state: '', pincode: '' }
  });

  const specialties = [
    'General physician', 'Gynecologist', 'Dermatologist', 
    'Pediatricians', 'Neurologist', 'Gastroenterologist'
  ];

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchDoctors();
  }, [navigate]);

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

  const showMessage = (text, type) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/admin/doctors', formData);
      if (response.data.success) {
        showMessage('Doctor added successfully!', 'success');
        setShowAddModal(false);
        fetchDoctors();
        resetForm();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to add doctor', 'error');
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctorId) {
      showMessage('Please select a doctor', 'error');
      return;
    }
    
    try {
      const response = await API.delete(`/admin/doctors/${selectedDoctorId}`);
      if (response.data.success) {
        showMessage('Doctor deleted successfully!', 'success');
        setShowDeleteModal(false);
        setSelectedDoctorId('');
        fetchDoctors();
      }
    } catch (error) {
      showMessage('Failed to delete doctor', 'error');
    }
  };

  const handleToggleAvailability = async (doctor) => {
    try {
      const response = await API.patch(`/admin/doctors/${doctor._id}/toggle-availability`, {
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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: 'Doctor@123',
      image: '',
      speciality: 'General physician',
      degree: 'MBBS',
      experience: '',
      about: '',
      fees: '',
      address: { line1: '', line2: '', city: '', state: '', pincode: '' }
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Loading doctors...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-doctors-container">
        <div className="page-header">
          <h1>Manage Doctors</h1>
          <div className="header-buttons">
            <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add New Doctor</button>
            <button className="delete-btn-header" onClick={() => setShowDeleteModal(true)}>🗑️ Delete Doctor</button>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="doctors-table-wrapper">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Speciality</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor._id}>
                  <td><img src={doctor.image} alt={doctor.name} className="doctor-thumb" /></td>
                  <td>{doctor.name}</td>
                  <td>{doctor.speciality}</td>
                  <td>{doctor.experience}</td>
                  <td>₹{doctor.fees}</td>
                  <td>
                    <span className={`status-badge ${doctor.available ? 'available' : 'unavailable'}`}>
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </span>
                   </td>
                  <td>
                    <button 
                      className={`action-btn ${doctor.available ? 'make-unavailable' : 'make-available'}`} 
                      onClick={() => handleToggleAvailability(doctor)}
                    >
                      {doctor.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Add New Doctor</h2>
              <form onSubmit={handleAddDoctor}>
                <div className="form-row">
                  <input type="text" name="name" placeholder="Doctor Name" value={formData.name} onChange={handleInputChange} required />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                  <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleInputChange} required />
                  <select name="speciality" value={formData.speciality} onChange={handleInputChange} required>
                    {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
                
                <div className="form-row">
                  <input type="text" name="degree" placeholder="Degree" value={formData.degree} onChange={handleInputChange} />
                  <input type="text" name="experience" placeholder="Experience (e.g., 5 Years)" value={formData.experience} onChange={handleInputChange} required />
                </div>
                
                <textarea name="about" placeholder="About Doctor" value={formData.about} onChange={handleInputChange} rows="3" required></textarea>
                
                <div className="form-row">
                  <input type="number" name="fees" placeholder="Consultation Fee" value={formData.fees} onChange={handleInputChange} required />
                </div>
                
                <h3>Address</h3>
                <div className="form-row">
                  <input type="text" name="line1" placeholder="Address Line 1" value={formData.address.line1} onChange={handleAddressChange} />
                  <input type="text" name="line2" placeholder="Address Line 2" value={formData.address.line2} onChange={handleAddressChange} />
                </div>
                <div className="form-row">
                  <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleAddressChange} />
                  <input type="text" name="state" placeholder="State" value={formData.address.state} onChange={handleAddressChange} />
                  <input type="text" name="pincode" placeholder="Pincode" value={formData.address.pincode} onChange={handleAddressChange} />
                </div>
                
                <div className="modal-buttons">
                  <button type="submit">Add Doctor</button>
                  <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Doctor Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
              <h2>Delete Doctor</h2>
              <div className="form-group">
                <label>Select Doctor</label>
                <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}>
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.speciality}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-buttons">
                <button className="delete-confirm-btn" onClick={handleDeleteDoctor}>Delete Doctor</button>
                <button type="button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDoctors;