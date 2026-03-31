import React from 'react'
import { useNavigate } from 'react-router-dom'
import './TopDoctors.css'

// Import doctor images
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

const TopDoctors = () => {
  const navigate = useNavigate()

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
    { id: 10, name: "Dr. Abhay Bhagwat", specialty: "Neurologist", image: doc10, available: true }
  ]

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`)
  }

  const handleMoreClick = () => {
    navigate('/doctors')
  }

  return (
    <section className="top-doctors-section" id="top-doctors">
      <div className="top-doctors-container">
        <div className="top-doctors-header">
          <h2>Top Doctors to Book</h2>
          <p>Simply browse through our extensive list of trusted doctors.</p>
        </div>

        <div className="doctors-grid2">
          {doctors.map((doctor) => (
            <div 
              className="doctor-card2" 
              key={doctor.id}
              onClick={() => handleDoctorClick(doctor.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="doctor-image-container2">
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
              <div className="doctor-info3">
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
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