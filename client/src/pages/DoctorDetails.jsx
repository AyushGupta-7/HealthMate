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
  const [unavailableSlots, setUnavailableSlots] = useState([]);
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

  // Fetch unavailable slots when date changes
  useEffect(() => {
    if (selectedDate && doctor) {
      fetchUnavailableSlots();
    }
  }, [selectedDate, doctor]);

  const fetchUnavailableSlots = async () => {
    try {
      const year = selectedDate.fullDate.getFullYear();
      const month = String(selectedDate.fullDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.fullDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log('Fetching slots for date:', formattedDate);
      
      const response = await API.get(`/doctors/${id}/slots/${formattedDate}`);
      console.log('Response:', response.data);
      
      if (response.data.success) {
        setUnavailableSlots(response.data.data?.unavailableSlots || []);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setUnavailableSlots([]);
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
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"
    // "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const dates = generateDates();

  const isSlotUnavailable = (time) => {
    return unavailableSlots.includes(time);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setMessage({ type: '', text: '' });
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage({ type: 'error', text: 'Please select date and time' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (isSlotUnavailable(selectedTime)) {
      setMessage({ type: 'error', text: 'This time slot is no longer available. Please select another time.' });
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
      console.error('Booking error:', error);
      
      const errorMsg = error.response?.data?.message || '';
      
      if (errorMsg.includes('already booked') || errorMsg.includes('duplicate') || error.response?.status === 400) {
        setMessage({ 
          type: 'error', 
          text: 'Slot is already booked. Please select another slot.' 
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to book appointment. Please try again.' });
      }
      
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      
      if (selectedDate) {
        await fetchUnavailableSlots();
      }
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
          {/* Doctor Info Card */}
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

          {/* Simple Text Message - Between Doctor Info and Booking Slots */}
          {message.text && (
            <div className={`simple-message ${message.type}`}>
              {message.type === 'success' ? '✓ ' : '⚠️ '}{message.text}
            </div>
          )}

          {doctor.available ? (
            <div className="booking-slots-card">
              <h2>Booking slots</h2>
              
              {/* Dates */}
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

              {/* Time Slots - Only show if a date is selected */}
              {selectedDate && (
                <>
                  <div className="times-scroll-container">
                    <div className="times-wrapper">
                      {timeSlots.map((time, index) => {
                        const isUnavailable = isSlotUnavailable(time);
                        return (
                          <button
                            key={index}
                            className={`time-slot-btn ${selectedTime === time ? 'selected' : ''} ${isUnavailable ? 'unavailable' : ''}`}
                            onClick={() => !isUnavailable && setSelectedTime(time)}
                            disabled={isUnavailable}
                            style={isUnavailable ? { opacity: 0.5, textDecoration: 'line-through', cursor: 'not-allowed' } : {}}
                          >
                            {time}
                            {isUnavailable && <span className="unavailable-label"> (Unavailable)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedTime && (
                    <div className="selected-slot-info">
                      <p>Selected: <strong>{selectedDate.formattedDate}</strong> at <strong>{selectedTime}</strong></p>
                    </div>
                  )}

                  <button 
                    className="book-appointment-btn" 
                    onClick={handleBookAppointment}
                    disabled={!selectedTime}
                  >
                    Book an appointment
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="doctor-unavailable-card">
              <h2>Doctor Currently Unavailable</h2>
              <p>This doctor is not accepting appointments at the moment. Please check back later or try another doctor.</p>
              <button className="back-btn" onClick={() => navigate('/doctors')}>
                Find Other Doctors
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDetails;