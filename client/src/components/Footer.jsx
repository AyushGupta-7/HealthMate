import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import healthmateLogo from '../assets/images/healthmateLogo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <Link to="/dashboard">
                <img 
                  src={healthmateLogo} 
                  alt="HealthMate Logo" 
                  className="footer-logo-image"
                />
                <h1>HealthMate</h1>
              </Link>
            </div>
            <p className="footer-tagline">
              Effortless Healthcare Scheduling
            </p>
            <p className="footer-description">
              Instantly book appointments with trusted doctors—from routine check-ups to specialist care—in just a few clicks.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">COMPANY</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">GET IN TOUCH</h4>
            <div className="footer-contact">
              <a href="tel:+919000090000" className="footer-phone">
                +91-90000-90000
              </a>
              <a href="mailto:customersupport@HealthMate.in" className="footer-email">
                customersupport@HealthMate.in
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} HealthMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;