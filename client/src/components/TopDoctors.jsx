import React from 'react'
import { useNavigate } from 'react-router-dom'
import './TopDoctors.css'

// Import doctor images
import doc13 from '../assets/images/doc13.png'
import doc2 from '../assets/images/doc2.png'
import doc3 from '../assets/images/doc3.png'
import doc4 from '../assets/images/doc4.png'
import doc5 from '../assets/images/doc5.png'
import doc6 from '../assets/images/doc6.png'
import doc7 from '../assets/images/doc7.png'
import doc8 from '../assets/images/doc8.png'

const TopDoctors = () => {
  const navigate = useNavigate()

  const doctors = [
    {
      id: 1,
      name: "Dr. Princy Singh",
      specialty: "Neurologist",
      image: doc13,
      available: true
    },
    {
      id: 2,
      name: "Dr. Ramit Sambhoyal",
      specialty: "General physician",
      image: doc4,
      available: true
    },
    {
      id: 3,
      name: "Dr. Sanjay Barude",
      specialty: "Gastroenterologist",
      image: doc3,
      available: true
    },
    {
      id: 4,
      name: "Dr. Shushmita Mukharjee",
      specialty: "Gynecologist",
      image: doc2,
      available: true
    },
    {
      id: 5,
      name: "Dr. Shubindu Mahindru",
      specialty: "Dermatologist",
      image: doc5,
      available: true
    },
    {
      id: 6,
      name: "Dr. Neelesh Jain",
      specialty: "Neurologist",
      image: doc6,
      available: true
    },
    {
      id: 7,
      name: "Dr. Manoj Bansal",
      specialty: "Gastroenterologist",
      image: doc7,
      available: true
    },
    {
      id: 8,
      name: "Dr. K L Prajapati",
      specialty: "Gastroenterologist",
      image: doc8,
      available: true
    }
  ]

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

        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor.id}>
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