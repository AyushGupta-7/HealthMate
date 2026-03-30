import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Specialty.css'

// Import SVG images
import generalPhysician from '../assets/images/General_physician.svg'
import gynecologist from '../assets/images/Gynecologist.svg'
import dermatologist from '../assets/images/Dermatologist.svg'
import pediatrician from '../assets/images/Pediatricians.svg'
import neurologist from '../assets/images/Neurologist.svg'
import gastroenterologist from '../assets/images/Gastroenterologist.svg'

const Specialty = () => {
  const navigate = useNavigate()

  const specialties = [
    { name: "General physician", path: "GeneralPhysician", image: generalPhysician, color: "#4a90e2", bgColor: "#e3f2fd" },
    { name: "Gynecologist", path: "Gynecologist", image: gynecologist, color: "#4a90e2", bgColor: "#fce4ec" },
    { name: "Dermatologist", path: "Dermatologist", image: dermatologist, color: "#4a90e2", bgColor: "#f3e5f5" },
    { name: "Pediatricians", path: "Pediatricians", image: pediatrician, color: "#4a90e2", bgColor: "#fff3e0" },
    { name: "Neurologist", path: "Neurologist", image: neurologist, color: "#4a90e2", bgColor: "#e0f7fa" },
    { name: "Gastroenterologist", path: "Gastroenterologist", image: gastroenterologist, color: "#4a90e2", bgColor: "#f1f8e9" }
  ]

  const handleSpecialtyClick = (path) => {
    navigate(`/doctors/${path}`)
  }

  return (
    <section className="specialty-section">
      <div className="specialty-container">
        <div className="specialty-header">
          <h2>Find by Speciality</h2>
          <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
        </div>
        
        <div className="specialties-grid">
          {specialties.map((specialty, index) => (
            <div 
              className="specialty-card" 
              key={index}
              onClick={() => handleSpecialtyClick(specialty.path)}
            >
              <div 
                className="specialty-circle" 
                style={{ 
                  backgroundColor: specialty.bgColor,
                  borderColor: specialty.color
                }}
              >
                <img 
                  src={specialty.image} 
                  alt={specialty.name}
                  className="specialty-image"
                />
              </div>
              <h3 className="specialty-name">{specialty.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Specialty