import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NavbarMain.css'
import healthmateLogo from '../assets/images/healthmateLogo.png'

const NavbarMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const avatarRef = useRef(null)
  
  const userName = localStorage.getItem('userName') || 'User'
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
  const userInitial = userName.charAt(0).toUpperCase()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    navigate('/login')
  }

  const handleMyProfile = () => {
    setIsDropdownOpen(false)
    navigate('/profile')
  }

  const handleMyAppointments = () => {
    setIsDropdownOpen(false)
    navigate('/my-appointments')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="navbar-main">
      <div className="nav-container2">
        <div className="nav-logo">
          <Link to="/dashboard">
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
            <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/doctors" onClick={() => setIsMenuOpen(false)}>All Doctors</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
          
          <div className="user-menu">
            <div 
              className="user-avatar" 
              onClick={toggleDropdown}
              ref={avatarRef}
            >
              <span className="user-initial">{userInitial}</span>
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <div className="dropdown-header">
                  <span className="dropdown-user-name">{userName}</span>
                  <span className="dropdown-user-email">{userEmail}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleMyProfile}>
                  <span className="dropdown-icon">👤</span>
                  My Profile
                </button>
                <button className="dropdown-item" onClick={handleMyAppointments}>
                  <span className="dropdown-icon">📅</span>
                  My Appointments
                </button>
                <button className="dropdown-item" onClick={() => {
                  setIsDropdownOpen(false)
                  navigate('/report-dashboard')
                }}>
                  <span className="dropdown-icon">📊</span>
                  My Reports
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
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

export default NavbarMain