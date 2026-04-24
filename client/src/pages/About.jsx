import React from 'react'
import Layout from '../components/Layout'
import './About.css'
import aboutImage from '../assets/images/about_image.png'

const About = () => {
  return (
    <Layout>
      <div className="about-page">
        <div className="about-container">
          <div className="about-section">
            <div className="about-header">
              <h1>ABOUT US</h1>
            </div>
            
            <div className="about-content">
              <div className="about-text">
                <p>
                  Welcome to <span className="highlight">HealthMate</span>, your trusted partner in managing your healthcare 
                  needs conveniently and efficiently. At HealthMate, we understand the challenges individuals face when it 
                  comes to scheduling doctor appointments and managing their health records.
                </p>
                <p>
                  The system allows patients to book doctor appointments online, manage their profiles, and securely upload 
                  medical reports such as lab test results and prescriptions. One of the key features of HealthMate is its 
                   <span className="highlight"> AI-based medical report analysis</span>, where uploaded PDF or image reports 
                  are processed to generate easy-to-understand summaries. This helps users better understand their health 
                  conditions without requiring deep medical knowledge.
                </p>
                <p>
                  HealthMate is committed to excellence in healthcare technology. We continuously strive to enhance our 
                  platform, integrating the latest advancements to improve user experience and deliver superior service. 
                  Whether you're booking your first appointment or managing ongoing care, HealthMate is here to support 
                  you every step of the way.
                </p>
              </div>
              <div className="about-image">
                <img src={aboutImage} alt="About HealthMate" />
              </div>
            </div>
          </div>

          <div className="vision-section">
            <h2>Our Vision</h2>
            <p>
              Our vision at <span className="highlight">HealthMate</span> is to create a seamless healthcare experience for 
              every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to 
              access the care you need, when you need it. HealthMate integrates AI capabilities to extract insights from 
              medical documents and supports bilingual summaries (English and Hindi), improving accessibility for a wider 
              range of users.
            </p>
          </div>

          <div className="why-choose-section">
            <h2>WHY CHOOSE US</h2>
            <div className="features-grid-about">
              <div className="feature-card-about">
                <h3>EFFICIENCY:</h3>
                <p>Streamlined appointment scheduling that fits into your busy lifestyle with AI-powered insights.</p>
              </div>
              <div className="feature-card-about">
                <h3>CONVENIENCE:</h3>
                <p>Access to a network of trusted healthcare professionals and secure medical record management.</p>
              </div>
              <div className="feature-card-about">
                <h3>PERSONALIZATION:</h3>
                <p>Tailored recommendations and reminders to help you stay on top of your health with bilingual support.</p>
              </div>
            </div>
            <div className="additional-info">
              <p>
                The platform follows <span className="highlight">secure authentication practices</span>, role-based access 
                control, and responsive design to ensure reliability across devices. Overall, HealthMate aims to bridge 
                the gap between patients and healthcare providers by combining appointment management, digital medical 
                records, and intelligent report summarization into a single, efficient healthcare solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default About