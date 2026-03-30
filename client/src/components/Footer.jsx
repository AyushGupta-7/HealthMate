import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <h3>HealthMate</h3>
            </div>
            <p className="footer-tagline">
              Effortless Healthcare Scheduling
            </p>
            <p className="footer-description">
              Instantly book appointments with trusted doctors—from routine check-ups to specialist care—in just a few clicks.
            </p>
          </div>

          {/* Company Links Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">COMPANY</h4>
            <ul className="footer-links">
              <li><a href="/dashboard">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Get in Touch Section */}
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

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} HealthMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;