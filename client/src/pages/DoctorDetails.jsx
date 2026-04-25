import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';
import './DoctorDetails.css';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/doctors/${id}`);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setMessage({ type: 'error', text: 'Failed to load doctor details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchBookedSlots();
    }
  }, [selectedDate, doctor]);

  const fetchBookedSlots = async () => {
    try {
      const response = await API.get(`/doctors/${id}/availability/${selectedDate.fullDate}`);
      setBookedSlots(response.data.data?.bookedSlots || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setBookedSlots([]);
    }
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date,
        formattedDate: `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`
      });
    }
    return dates;
  };

  const timeSlots = [
    "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const dates = generateDates();

  const isSlotBooked = (time) => {
    return bookedSlots.includes(time);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage({ type: 'error', text: 'Please select date and time' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      const appointmentData = {
        doctorId: doctor._id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.speciality,
        doctorImage: doctor.image,
        doctorAddress: typeof doctor.address === 'object' 
          ? `${doctor.address.line1 || ''}, ${doctor.address.city || ''}` 
          : doctor.address || '',
        date: selectedDate.formattedDate,
        time: selectedTime,
        fee: doctor.fees
      };

      const response = await API.post('/appointments', appointmentData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Appointment booked successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/my-appointments');
        }, 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to book appointment' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="doctor-details-page">
          <div className="doctor-details-container">
            <div className="loading-spinner">Loading doctor details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="doctor-details-page">
          <div className="doctor-details-container">
            <div className="doctor-not-found">
              <h2>Doctor not found</h2>
              <button onClick={() => navigate('/doctors')}>Back to Doctors</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const formatAddress = () => {
    if (typeof doctor.address === 'object') {
      const parts = [];
      if (doctor.address.line1) parts.push(doctor.address.line1);
      if (doctor.address.line2) parts.push(doctor.address.line2);
      if (doctor.address.city) parts.push(doctor.address.city);
      if (doctor.address.state) parts.push(doctor.address.state);
      if (doctor.address.pincode) parts.push(doctor.address.pincode);
      return parts.join(', ');
    }
    return doctor.address || 'Address not available';
  };

  return (
    <Layout>
      <div className="doctor-details-page">
        <div className="doctor-details-container">
          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.type === 'success' ? '✓' : '⚠️'} {message.text}
            </div>
          )}

          <div className="doctor-info-card">
            <div className="doctor-info2">
              <div className='imageBg'>
                <img src={doctor.image} alt={doctor.name} />
              </div>
              <div className="doctor-content">
                <h1>{doctor.name}</h1>
                <p className="doctor-specialization">
                  {doctor.degree} - {doctor.speciality} {doctor.experience}
                </p>
                <div className="about-section">
                  <h3>About</h3>
                  <p>{doctor.about}</p>
                </div>
                <p className="appointment-fee">
                  <strong>Appointment fee:</strong> ₹{doctor.fees}
                </p>
                <p className="doctor-address">
                  <strong>Address:</strong> {formatAddress()}
                </p>
                <p className="doctor-status">
                  <strong>Status:</strong>{' '}
                  <span className={doctor.available ? 'available' : 'unavailable'}>
                    {doctor.available ? 'Available for consultation' : 'Currently unavailable'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="booking-slots-card">
            <h2>Booking slots</h2>
            
            <div className="dates-scroll-container">
              <div className="dates-wrapper">
                {dates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`date-card ${selectedDate?.date === date.date ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className="date-day">{date.day}</div>
                    <div className="date-number">{date.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="times-scroll-container">
              <div className="times-wrapper">
                {timeSlots.map((time, index) => {
                  const isBooked = selectedDate ? isSlotBooked(time) : false;
                  return (
                    <button
                      key={index}
                      className={`time-slot-btn ${selectedTime === time ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={!selectedDate || isBooked}
                    >
                      {time}
                      {isBooked && <span className="booked-label">(Booked)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && selectedTime && (
              <div className="selected-slot-info">
                <p>Selected: <strong>{selectedDate.formattedDate}</strong> at <strong>{selectedTime}</strong></p>
              </div>
            )}

            <button 
              className="book-appointment-btn" 
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || !doctor.available}
            >
              {!doctor.available ? 'Doctor Unavailable' : 'Book an appointment'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetails;