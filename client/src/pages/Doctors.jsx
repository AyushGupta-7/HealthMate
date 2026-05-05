import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import API from '../services/api'
import './Doctors.css'

const Doctors = () => {
  const { specialtyParam } = useParams()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const specialties = [
    { name: "General physician", path: "GeneralPhysician" },
    { name: "Gynecologist", path: "Gynecologist" },
    { name: "Dermatologist", path: "Dermatologist" },
    { name: "Pediatricians", path: "Pediatricians" },
    { name: "Neurologist", path: "Neurologist" },
    { name: "Gastroenterologist", path: "Gastroenterologist" }
  ]

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

  // Fetch doctors from backend
  useEffect(() => {
    fetchDoctors()
  }, [specialtyParam])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError('')
      
      let url = '/doctors'
      if (specialtyParam) {
        const specialty = specialties.find(s => s.path === specialtyParam)
        if (specialty) {
          url = `/doctors/specialty/${encodeURIComponent(specialty.name)}`
        }
      }
      
      console.log('Fetching doctors from:', url) // Debug log
      const response = await API.get(url)
      console.log('Response:', response.data) // Debug log
      
      if (response.data.success) {
        setDoctors(response.data.data)
      } else {
        setError('Failed to load doctors')
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      setError('Failed to load doctors. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getSpecialtyFromPath = (path) => {
    if (!path) return 'All'
    const specialty = specialties.find(s => s.path === path)
    return specialty ? specialty.name : 'All'
  }

  const getSpecialtyPath = (specialtyName) => {
    if (specialtyName === 'All') return ''
    const specialty = specialties.find(s => s.name === specialtyName)
    return specialty ? specialty.path : ''
  }

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty)
    const path = getSpecialtyPath(specialty)
    if (path) {
      navigate(`/doctors/${path}`)
    } else {
      navigate('/doctors')
    }
  }

  useEffect(() => {
    if (specialtyParam) {
      const specialty = getSpecialtyFromPath(specialtyParam)
      setSelectedSpecialty(specialty)
    } else {
      setSelectedSpecialty('All')
    }
  }, [specialtyParam])

  const filteredDoctors = selectedSpecialty === 'All' 
    ? doctors 
    : doctors.filter(doctor => doctor.speciality === selectedSpecialty)

  if (loading) {
    return (
      <Layout>
        <div className="doctors-page">
          <div className="doctors-container">
            <div className="loading-spinner">Loading doctors...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="doctors-page">
          <div className="doctors-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="doctors-page">
        <div className="doctors-container">
          <div className="doctors-header">
            <h1>Browse through the doctors specialist.</h1>
          </div>

          <div className="doctors-content">
            <div className="specialties-sidebar">
              <div 
                className={`specialty-item ${selectedSpecialty === 'All' ? 'active' : ''}`}
                onClick={() => handleSpecialtyChange('All')}
              >
                All
              </div>
              {specialties.map((specialty, index) => (
                <div 
                  key={index}
                  className={`specialty-item ${selectedSpecialty === specialty.name ? 'active' : ''}`}
                  onClick={() => handleSpecialtyChange(specialty.name)}
                >
                  {specialty.name}
                </div>
              ))}
            </div>

            <div className="doctors-grid-container">
              <div className="doctors-grid">
                {filteredDoctors.map((doctor) => (
                  <div 
                    className="doctor-card" 
                    key={doctor._id} 
                    onClick={() => navigate(`/doctor/${doctor._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="doctor-image-container">
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
                    <div className="doctor-info">
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <p className="doctor-specialty">{doctor.speciality}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredDoctors.length === 0 && (
                <div className="no-doctors">
                  <p>No doctors found in this specialty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Doctors