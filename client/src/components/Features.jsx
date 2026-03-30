import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Online Appointment Booking",
      description: "Book appointments with top doctors instantly. Choose your preferred time slot and get confirmation in seconds.",
      icon: "📅",
      iconBg: "#e8f0fe",
      iconColor: "#4a90e2",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Medical Report Upload",
      description: "Securely upload and store all your medical reports in one place. Access them anytime, anywhere.",
      icon: "📄",
      iconBg: "#e8f5e9",
      iconColor: "#2ecc71",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "AI Report Analysis",
      description: "Get instant AI-powered insights from your medical reports. Smart analysis with personalized recommendations.",
      icon: "🤖",
      iconBg: "#fff3e0",
      iconColor: "#f39c12",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      title: "Bilingual Support",
      description: "Seamlessly switch between English and Hindi. Making healthcare accessible to everyone.",
      icon: "🌐",
      iconBg: "#e3f2fd",
      iconColor: "#2196f3",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      subtext: "English + Hindi"
    },
    {
      id: 5,
      title: "Secure Authentication",
      description: "Enterprise-grade security with two-factor authentication. Your health data is always protected.",
      icon: "🔒",
      iconBg: "#fce4ec",
      iconColor: "#e91e63",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      id: 6,
      title: "Role-Based Dashboard",
      description: "Personalized experience for patients, doctors, and admins. Everything you need, right where you need it.",
      icon: "👤",
      iconBg: "#e8eaf6",
      iconColor: "#5c6bc0",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
    }
  ];

  return (
    <section className="features" id="features">
      {/* Decorative elements */}
      <div className="features-bg-shape shape-1"></div>
      <div className="features-bg-shape shape-2"></div>
      <div className="features-bg-shape shape-3"></div>
      
      <div className="container">
        {/* Section Header */}
        <div className="features-header">
          <span className="section-badge">Why Choose Us</span>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.id}>
              <div className="feature-icon-wrapper" style={{ background: feature.iconBg }}>
                <span className="feature-icon" style={{ color: feature.iconColor }}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              {feature.subtext && (
                <span className="feature-badge">{feature.subtext}</span>
              )}
              <div className="feature-glow" style={{ background: feature.gradient }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;