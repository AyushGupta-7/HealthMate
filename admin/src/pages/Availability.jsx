import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import API from '../services/api';
import './Availability.css';

const Availability = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [message, setMessage] = useState('');

  const timeSlots = [
    "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
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

  const handleSlotToggle = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || selectedSlots.length === 0) {
      setMessage('Please select doctor, date, and at least one time slot');
      return;
    }

    try {
      await API.put(`/admin/doctors/${selectedDoctor}/availability`, {
        date: selectedDate,
        slots: selectedSlots.map(time => ({ time, isAvailable: true }))
      });
      setMessage('Availability updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedSlots([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating availability');
    }
  };

  return (
    <AdminLayout>
      <div className="availability-management">
        <h1>Set Doctor Availability</h1>
        
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit} className="availability-form">
          <div className="form-group">
            <label>Select Doctor</label>
            <select value={selectedDoctor || ''} onChange={(e) => setSelectedDoctor(e.target.value)} required>
              <option value="">-- Select Doctor --</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Select Available Time Slots</label>
            <div className="time-slots-grid">
              {timeSlots.map(slot => (
                <label key={slot} className="slot-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSlots.includes(slot)}
                    onChange={() => handleSlotToggle(slot)}
                  />
                  {slot}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">Save Availability</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Availability;