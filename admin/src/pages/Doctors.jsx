import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../services/api';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    qualification: 'MBBS',
    specialization: 'General physician',
    experience: '',
    about: '',
    fee: '',
    image: '',
    address: '',
  });

  const specializations = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await API.get('/admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await API.put(`/admin/doctors/${editingDoctor._id}`, formData);
        setMessage('Doctor updated successfully!');
      } else {
        await API.post('/admin/doctors', formData);
        setMessage('Doctor added successfully!');
      }
      setTimeout(() => setMessage(''), 3000);
      setShowModal(false);
      setEditingDoctor(null);
      resetForm();
      fetchDoctors();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving doctor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await API.delete(`/admin/doctors/${id}`);
        setMessage('Doctor deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchDoctors();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting doctor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      qualification: 'MBBS',
      specialization: 'General physician',
      experience: '',
      about: '',
      fee: '',
      image: '',
      address: '',
    });
  };

  return (
    <AdminLayout>
      <div className="doctors-management">
        <div className="page-header">
          <h1>Manage Doctors</h1>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New Doctor</button>
        </div>

        {message && <div className="success-message">{message}</div>}

        <div className="doctors-table-container">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience}</td>
                  <td>₹{doctor.fee}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(doctor._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingDoctor(null); resetForm(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Doctor Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <select value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})}>
                  {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                </select>
                <input type="text" placeholder="Experience (e.g., 5 Years)" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required />
                <textarea placeholder="About Doctor" value={formData.about} onChange={(e) => setFormData({...formData, about: e.target.value})} required />
                <input type="number" placeholder="Consultation Fee (₹)" value={formData.fee} onChange={(e) => setFormData({...formData, fee: e.target.value})} required />
                <input type="text" placeholder="Image URL (optional)" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                <button type="submit">{editingDoctor ? 'Update' : 'Add'} Doctor</button>
                <button type="button" onClick={() => { setShowModal(false); setEditingDoctor(null); resetForm(); }}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Doctors;