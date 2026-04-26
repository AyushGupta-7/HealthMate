import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import './AdminAvailability.css';

const AdminAvailability = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentUnavailableSlots, setCurrentUnavailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const timeSlots = [
    "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchDoctors();
  }, [navigate]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchCurrentUnavailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      showMessage('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUnavailableSlots = async () => {
    try {
      const response = await API.get(`/doctors/${selectedDoctor}/slots/${selectedDate}`);
      if (response.data.success) {
        setCurrentUnavailableSlots(response.data.data.unavailableSlots || []);
        setSelectedSlots(response.data.data.unavailableSlots || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSlotToggle = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const isSlotCurrentlyUnavailable = (slot) => {
    return currentUnavailableSlots.includes(slot);
  };

  const handleSetUnavailable = async () => {
    if (!selectedDoctor || !selectedDate || selectedSlots.length === 0) {
      showMessage('Please select doctor, date, and at least one time slot', 'error');
      return;
    }

    try {
      const response = await API.post(`/admin/doctors/${selectedDoctor}/slots/unavailable`, {
        date: selectedDate,
        slots: selectedSlots
      });
      
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        fetchCurrentUnavailableSlots();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update availability', 'error');
    }
  };

  const handleSetAvailable = async () => {
    if (!selectedDoctor || !selectedDate || selectedSlots.length === 0) {
      showMessage('Please select doctor, date, and at least one time slot', 'error');
      return;
    }

    try {
      const response = await API.post(`/admin/doctors/${selectedDoctor}/slots/available`, {
        date: selectedDate,
        slots: selectedSlots
      });
      
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        fetchCurrentUnavailableSlots();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update availability', 'error');
    }
  };

  const handleFullDayUnavailable = async () => {
    if (!selectedDoctor || !selectedDate) {
      showMessage('Please select doctor and date', 'error');
      return;
    }

    try {
      const response = await API.post(`/admin/doctors/${selectedDoctor}/slots/full-day-unavailable`, {
        date: selectedDate
      });
      
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        fetchCurrentUnavailableSlots();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update availability', 'error');
    }
  };

  const handleFullDayAvailable = async () => {
    if (!selectedDoctor || !selectedDate) {
      showMessage('Please select doctor and date', 'error');
      return;
    }

    try {
      const response = await API.post(`/admin/doctors/${selectedDoctor}/slots/full-day-available`, {
        date: selectedDate
      });
      
      if (response.data.success) {
        showMessage(response.data.message, 'success');
        fetchCurrentUnavailability();
      }
    } catch (error) {
      showMessage(error.response?.data?.message || 'Failed to update availability', 'error');
    }
  };

  const selectedDoctorName = doctors.find(d => d._id === selectedDoctor)?.name || '';
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <AdminLayout>
        <div className="av-loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="av-availability-container">
        <h1 className="av-title">Set Doctor Availability</h1>
        <p className="av-subtitle">Manage doctor availability for specific dates and times</p>

        {message.text && (
          <div className={`av-message av-message-${message.type}`}>{message.text}</div>
        )}

        <div className="av-availability-card">
          <div className="av-form-group">
            <label className="av-label">Select Doctor</label>
            <select className="av-select" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
              <option value="">-- Select Doctor --</option>
              {doctors.map(doctor => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.speciality}
                </option>
              ))}
            </select>
          </div>

          <div className="av-form-group">
            <label className="av-label">Select Date</label>
            <input 
              type="date" 
              className="av-date-input"
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={today}
            />
          </div>

          {selectedDoctorName && selectedDate && (
            <div className="av-selected-info">
              <p className="av-selected-text">Managing availability for: <strong>{selectedDoctorName}</strong> on <strong>{selectedDate}</strong></p>
              <p className="av-auto-reset-note">⚠️ Note: Past dates are automatically cleaned up</p>
            </div>
          )}

          <div className="av-form-group">
            <label className="av-label">Select Time Slots to Mark Unavailable</label>
            <div className="av-time-slots-grid">
              {timeSlots.map(slot => {
                const isUnavailable = isSlotCurrentlyUnavailable(slot);
                const isSelected = selectedSlots.includes(slot);
                return (
                  <label 
                    key={slot} 
                    className={`av-slot-checkbox ${isUnavailable ? 'av-already-unavailable' : ''} ${isSelected ? 'av-selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSlotToggle(slot)}
                      className="av-slot-input"
                    />
                    {slot}
                    {isUnavailable && <span className="av-unavailable-badge">(Currently Unavailable)</span>}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="av-action-buttons">
            <div className="av-action-group">
              <h3 className="av-action-title">Mark as Unavailable</h3>
              <div className="av-button-group">
                <button className="av-btn av-btn-unavailable" onClick={handleSetUnavailable} disabled={!selectedDoctor || !selectedDate}>
                  Mark Selected Slots Unavailable
                </button>
                <button className="av-btn av-btn-full-unavailable" onClick={handleFullDayUnavailable} disabled={!selectedDoctor || !selectedDate}>
                  Mark Full Day Unavailable
                </button>
              </div>
            </div>

            <div className="av-action-group">
              <h3 className="av-action-title">Mark as Available</h3>
              <div className="av-button-group">
                <button className="av-btn av-btn-available" onClick={handleSetAvailable} disabled={!selectedDoctor || !selectedDate}>
                  Mark Selected Slots Available
                </button>
                <button className="av-btn av-btn-full-available" onClick={handleFullDayAvailable} disabled={!selectedDoctor || !selectedDate}>
                  Mark Full Day Available
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="av-info-note">
          <h3 className="av-info-title">ℹ️ How Availability Works:</h3>
          <ul className="av-info-list">
            <li>✅ <strong>By default, all doctors are available</strong> for all time slots.</li>
            <li>🔴 Mark slots as <strong>Unavailable</strong> to block patients from booking.</li>
            <li>🟢 Mark slots as <strong>Available</strong> to reopen previously blocked slots <strong>(anytime before the date)</strong>.</li>
            <li>📅 <strong>Full Day Unavailable</strong> will block all time slots for that day.</li>
            <li>📅 <strong>Full Day Available</strong> will clear all blocked slots for that day.</li>
            <li>📌 <strong>Already booked appointments</strong> will automatically show as unavailable.</li>
            <li>🗑️ <strong>Past dates are automatically cleaned up</strong> - you don't need to manage old dates.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAvailability;