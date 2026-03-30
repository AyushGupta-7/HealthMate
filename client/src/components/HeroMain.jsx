import React from 'react'
import './Hero.css'
import backgroundImage from '../assets/images/background.png'

const Hero = () => {
  return (
    <section className="hero" id="book">
      <div className="hero-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hero-overlay-light"></div>
      </div>
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-title">
            Smart Healthcare, <br />
            <span className="highlight">Simplified with AI.</span>
          </h1>
          <p className="hero-description">
            Book appointments, manage reports, and get AI-powered health insights in seconds.
          </p>
          <div className="hero-buttons">
            <a href="/doctors"><button className="btn-book" >Book Appointment</button></a>
            <a href="/signup"><button className="btn-upload">Upload Report</button></a>
          </div>
        </div>
        
        {/* <div className="hero-right">
          <div className="info-card appointment-info-card">
            <h3>Upcoming Appointment</h3>
            <p className="appointment-time">11:00 - 110 Jan</p>
            <p className="doctor-name">Doctor: Dr. Doctor</p>
          </div>
          
          <div className="info-card report-info-card">
            <h3>Report Summary</h3>
            <div className="report-circle">
              <span className="report-percentage">99%</span>
              <span className="report-status">Status</span>
            </div>
          </div>
          
          <div className="info-card insights-info-card">
            <h3>
              <span className="ai-badge">AI</span>
              <span>Health Insights</span>
            </h3>
            <ul className="insights-list">
              <li>✓ AI recommendation</li>
              <li>✓ Key recommendations</li>
              <li>✓ Key recommendations</li>
            </ul>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default Hero