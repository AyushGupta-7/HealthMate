import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Specialty.css'

import generalPhysician from '../assets/images/General_physician.svg'
import gynecologist from '../assets/images/Gynecologist.svg'
import dermatologist from '../assets/images/Dermatologist.svg'
import pediatrician from '../assets/images/Pediatricians.svg'
import neurologist from '../assets/images/Neurologist.svg'
import gastroenterologist from '../assets/images/Gastroenterologist.svg'

const Specialty = () => {
  const navigate = useNavigate()

  const specialties = [
    { name: "General physician", path: "GeneralPhysician", image: generalPhysician, color: "#1a6b8a", bgColor: "#e8f0f5" },
    { name: "Gynecologist", path: "Gynecologist", image: gynecologist, color: "#1a6b8a", bgColor: "#f8eef0" },
    { name: "Dermatologist", path: "Dermatologist", image: dermatologist, color: "#1a6b8a", bgColor: "#f0eef8" },
    { name: "Pediatricians", path: "Pediatricians", image: pediatrician, color: "#1a6b8a", bgColor: "#fef5e8" },
    { name: "Neurologist", path: "Neurologist", image: neurologist, color: "#1a6b8a", bgColor: "#e8f4f8" },
    { name: "Gastroenterologist", path: "Gastroenterologist", image: gastroenterologist, color: "#1a6b8a", bgColor: "#f0f8e8" }
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