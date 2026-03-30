import React from 'react'
import './TrustedSection.css'

const TrustedSection = () => {
  const trustPoints = [
    {
      title: "Secure Data Handling",
      description: "Secure data handling with advanced encryption and data protection measures"
    },
    {
      title: "Easy to Use",
      description: "Intuitive interface designed for users of all technical backgrounds"
    },
    {
      title: "Fast AI Insights",
      description: "Get instant AI-powered health insights and recommendations"
    }
  ]

  return (
    <section className="trusted-section">
      <div className="container">
        <h2 className="section-title">Trusted by Patients & Doctors</h2>
        <div className="trust-grid">
          {trustPoints.map((point, index) => (
            <div className="trust-card" key={index}>
              <div className="trust-icon">
                {index === 0 && "🔒"}
                {index === 1 && "👍"}
                {index === 2 && "⚡"}
              </div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustedSection