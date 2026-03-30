import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import healthmateLogo from '../assets/images/healthmateLogo.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <img 
              src={healthmateLogo} 
              alt="HealthMate Logo" 
              className="logo-image"
            />
            <h1>HealthMate</h1>
          </Link>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Book Now</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            <li><a href="/login" className="nav-login-link" onClick={handleLogin}>Login</a></li>
          </ul>
          <button className="btn-get-started" onClick={handleGetStarted}>Get Started</button>
        </div>
        
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar