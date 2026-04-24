import React, { useState } from 'react'
import Layout from '../components/Layout'
import './Contact.css'
import contactImage from '../assets/images/contact_image.png'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

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
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <button type="submit" className="send-btn">
                    Send Message
                  </button>
                  {isSubmitted && (
                    <div className="success-message">
                      ✓ Message sent successfully! We'll get back to you soon.
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