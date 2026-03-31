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
            <a href="/login"><button className="btn-book" >Book Appointment</button></a>
            <a href="/signup"><button className="btn-upload">Upload Report</button></a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero