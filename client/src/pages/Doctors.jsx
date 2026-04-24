import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import './Doctors.css'

import doc1 from '../assets/images/doc1.png'
import doc2 from '../assets/images/doc2.png'
import doc3 from '../assets/images/doc3.png'
import doc4 from '../assets/images/doc4.png'
import doc5 from '../assets/images/doc5.png'
import doc6 from '../assets/images/doc6.png'
import doc7 from '../assets/images/doc7.png'
import doc8 from '../assets/images/doc8.png'
import doc9 from '../assets/images/doc9.png'
import doc10 from '../assets/images/doc10.png'
import doc11 from '../assets/images/doc11.png'
import doc12 from '../assets/images/doc12.png'
import doc13 from '../assets/images/doc13.png'
import doc14 from '../assets/images/doc14.png'
import doc15 from '../assets/images/doc15.png'
import doc16 from '../assets/images/doc16.png'
import doc17 from '../assets/images/doc17.png'
import doc18 from '../assets/images/doc18.png'
import doc19 from '../assets/images/doc19.png'
import doc20 from '../assets/images/doc20.png'
import doc21 from '../assets/images/doc21.png'
import doc22 from '../assets/images/doc22.png'
import doc23 from '../assets/images/doc23.png'
import doc24 from '../assets/images/doc24.png'
import doc25 from '../assets/images/doc25.png'

const Doctors = () => {
  const { specialtyParam } = useParams()
  const navigate = useNavigate()
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')

  const specialties = [
    { name: "General physician", path: "GeneralPhysician" },
    { name: "Gynecologist", path: "Gynecologist" },
    { name: "Dermatologist", path: "Dermatologist" },
    { name: "Pediatricians", path: "Pediatricians" },
    { name: "Neurologist", path: "Neurologist" },
    { name: "Gastroenterologist", path: "Gastroenterologist" }
  ]

  const doctors = [
    { id: 1, name: "Dr. Princy Singh", specialty: "Neurologist", image: doc1, available: true },
    { id: 2, name: "Dr. Ramit Sambhayal", specialty: "General physician", image: doc2, available: true },
    { id: 3, name: "Dr. Sanjay Barude", specialty: "Gastroenterologist", image: doc3, available: true },
    { id: 4, name: "Dr. Shushmita Mukharjee", specialty: "Gynecologist", image: doc4, available: true },
    { id: 5, name: "Dr. Shubindu Mahindru", specialty: "Dermatologist", image: doc5, available: true },
    { id: 6, name: "Dr. Neelesh Jain", specialty: "Neurologist", image: doc6, available: true },
    { id: 7, name: "Dr. Manoj Bansal", specialty: "Gastroenterologist", image: doc7, available: true },
    { id: 8, name: "Dr. K L Prajapati", specialty: "Gastroenterologist", image: doc8, available: true },
    { id: 9, name: "Dr. Indu Bhawna", specialty: "Neurologist", image: doc9, available: true },
    { id: 10, name: "Dr. Abhay Bhagwat", specialty: "Neurologist", image: doc10, available: true },
    { id: 11, name: "Dr. Nipun Puranik", specialty: "Neurologist", image: doc11, available: true },
    { id: 12, name: "Dr. Aveg Bhandari", specialty: "Neurologist", image: doc12, available: true },
    { id: 13, name: "Dr. Alok Mandliya", specialty: "Neurologist", image: doc13, available: true },
    { id: 14, name: "Dr. Saloni Dashore", specialty: "General physician", image: doc14, available: true },
    { id: 15, name: "Dr. Rajesh karanjiya", specialty: "General physician", image: doc15, available: true },
    { id: 16, name: "Dr. Himanshu Kelkar", specialty: "Pediatricians", image: doc16, available: true },
    { id: 17, name: "Dr. Kawita Bapat", specialty: "Gynecologist", image: doc17, available: true },
    { id: 18, name: "Dr. Diksha Chachria", specialty: "Gynecologist", image: doc18, available: true },
    { id: 19, name: "Dr. Manju Patidar", specialty: "Gynecologist", image: doc19, available: true },
    { id: 20, name: "Dr. Shaheen Kapoor", specialty: "Dermatologist", image: doc20, available: true },
    { id: 21, name: "Dr. Shraddha Pitalia", specialty: "Dermatologist", image: doc21, available: true },
    { id: 22, name: "Dr. Dilip Hemnani", specialty: "Dermatologist", image: doc22, available: true },
    { id: 23, name: "Dr. Harshita Kothari", specialty: "Dermatologist", image: doc23, available: true },
    { id: 24, name: "Dr. Ashish Jaiswal", specialty: "Pediatricians", image: doc24, available: true },
    { id: 25, name: "Dr. Mahendra Rathod", specialty: "Pediatricians", image: doc25, available: true }
  ]

  const getSpecialtyPath = (specialtyName) => {
    if (specialtyName === 'All') return ''
    const specialty = specialties.find(s => s.name === specialtyName)
    return specialty ? specialty.path : ''
  }

  const getSpecialtyFromPath = (path) => {
    if (!path) return 'All'
    const specialty = specialties.find(s => s.path === path)
    return specialty ? specialty.name : 'All'
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
    : doctors.filter(doctor => doctor.specialty === selectedSpecialty)

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
                    key={doctor.id} 
                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="doctor-image-container">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="doctor-image"
                      />
                      <div className="availability-badge">
                        <span className="dot"></span>
                        Available
                      </div>
                    </div>
                    <div className="doctor-info">
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <p className="doctor-specialty">{doctor.specialty}</p>
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