import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import './TopDoctors.css'

const TopDoctors = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Helper function to fix image URLs
  const fixImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // Replace localhost with production URL
    if (imageUrl.includes('localhost:5000')) {
      return imageUrl.replace('http://localhost:5000', 'https://healthmate-5kl0.onrender.com');
    }
    return imageUrl;
  };

  // Helper function to get fallback image
  const getFallbackImage = (doctorName) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=1a6b8a&color=white&size=150&rounded=true`;
  };

  useEffect(() => {
    fetchTopDoctors()
  }, [])

  const fetchTopDoctors = async () => {
    try {
      setLoading(true)
      const response = await API.get('/doctors')
      if (response.data.success) {
        // Get first 10 doctors for top section
        setDoctors(response.data.data.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setError('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`)
  }

  const handleMoreClick = () => {
    navigate('/doctors')
  }

  if (loading) {
    return (
      <section className="top-doctors-section" id="top-doctors">
        <div className="top-doctors-container">
          <div className="top-doctors-header">
            <h2>Top Doctors to Book</h2>
            <p>Simply browse through our extensive list of trusted doctors.</p>
          </div>
          <div className="loading-spinner">Loading top doctors...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="top-doctors-section" id="top-doctors">
        <div className="top-doctors-container">
          <div className="top-doctors-header">
            <h2>Top Doctors to Book</h2>
            <p>Simply browse through our extensive list of trusted doctors.</p>
          </div>
          <div className="error-message">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="top-doctors-section" id="top-doctors">
      <div className="top-doctors-container">
        <div className="top-doctors-header">
          <h2>Top Doctors to Book</h2>
          <p>Simply browse through our extensive list of trusted doctors.</p>
        </div>

        <div className="doctors-grid2">
          {doctors.map((doctor, index) => (
            <div 
              className="doctor-card2" 
              key={doctor._id}
              onClick={() => handleDoctorClick(doctor._id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="doctor-image-container2">
                <img 
                  src={fixImageUrl(doctor.image) || getFallbackImage(doctor.name)} 
                  alt={doctor.name}
                  className="doctor-image"
                  onError={(e) => {
                    e.target.src = getFallbackImage(doctor.name);
                  }}
                />
                <div className="availability-badge">
                  <span className="dot"></span>
                  {doctor.available ? 'Available' : 'Not Available'}
                </div>
              </div>
              <div className="doctor-info3">
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.speciality}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="more-button-container">
          <button className="more-btn" onClick={handleMoreClick}>
            More
          </button>
        </div>
      </div>
    </section>
  )
}

export default TopDoctors