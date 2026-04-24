import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import healthmateLogo from '../assets/images/healthmateLogo.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard')
    } else {
      navigate('/signup')
    }
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
            <li><Link to="/login" className="nav-login-link" onClick={handleLogin}>Login</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
          <button className="btn-get-started" onClick={handleGetStarted}>
            Get Started
          </button>
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