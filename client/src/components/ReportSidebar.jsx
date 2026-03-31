import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './ReportSidebar.css'

const ReportSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/report-dashboard', icon: '📊', label: 'Dashboard', description: 'Overview of your health data' },
    { path: '/vitals', icon: '❤️', label: 'Vitals', description: 'Track your health metrics' },
    { path: '/ai-insights', icon: '🤖', label: 'AI Insights', description: 'AI-powered health analysis' },
    { path: '/previous-reports', icon: '📄', label: 'Previous Reports', description: 'View all medical reports' },
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="report-sidebar">
      <div className="sidebar-header">
        <h3>Health Reports</h3>
        <p>Manage your health data</p>
      </div>
      <nav className="report-nav">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`report-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-content">
              <div className="nav-label">{item.label}</div>
              <div className="nav-description">{item.description}</div>
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default ReportSidebar