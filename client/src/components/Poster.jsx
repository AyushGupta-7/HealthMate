import React from 'react'
import './Poster.css'
import appointmentImg from '../assets/images/appointment_img.png'

const Poster = () => {
  const scrollToTopDoctors = () => {
    const topDoctorsSection = document.getElementById('top-doctors')
    if (topDoctorsSection) {
      topDoctorsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className="poster-section">
      <div className="poster-container">
        <div className="poster-card">
          <div className="poster-content">
            <h2 className="poster-title">
              Book Appointment <br />
              With 100+ Trusted Doctors
            </h2>
            <button className="book-appointment-btn" onClick={scrollToTopDoctors}>
              Book appointment
            </button>
          </div>
          <div className="poster-image-wrapper">
            <img 
              src={appointmentImg} 
              alt="Book Appointment" 
              className="poster-image"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Poster