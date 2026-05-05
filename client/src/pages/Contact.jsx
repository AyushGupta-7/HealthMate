import React, { useState } from 'react'
import Layout from '../components/Layout'
import './Contact.css'
import contactImage from '../assets/images/contact_image.png'

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMessage('');
  
  console.log('Sending to:', `${API_URL}/contact`);
  console.log('Form data:', formData);
  
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok && data.success) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      setErrorMessage(data.message || 'Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Detailed error:', error);
    setErrorMessage(`Error: ${error.message}. Please try again.`);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Layout>
      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-header">
            <h1>CONTACT US</h1>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="office-section">
                <h2>OUR OFFICE</h2>
                <div className="office-details">
                  <p className="address">Chitkara University</p>
                  <p>Baddi, Himachal, INDIA</p>
                  <p className="tel">Tel: (01795) 555-0132</p>
                  <p className="email">Email: customersupport@healthmate.in</p>
                </div>
              </div>

              <div className="mailbox-section">
                <h2>SEND US A MESSAGE</h2>
                <p className="mailbox-description">
                  Have questions or feedback? We'd love to hear from you. 
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
                
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  ></textarea>
                  
                  <button type="submit" className="send-btn" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {isSubmitted && (
                    <div className="success-message">
                      <div className="success-icon">✓</div>
                      <div className="success-content">
                        <strong>Message Sent Successfully!</strong>
                        <p>Thank you for contacting HealthMate. We have received your message and will get back to you within 24 hours. A confirmation email has been sent to your inbox.</p>
                      </div>
                    </div>
                  )}
                  
                  {errorMessage && (
                    <div className="error-message">
                      <div className="error-icon">⚠️</div>
                      <div className="error-content">
                        <strong>Failed to Send Message</strong>
                        <p>{errorMessage}</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="contact-image">
              <img src={contactImage} alt="Contact Us" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Contact