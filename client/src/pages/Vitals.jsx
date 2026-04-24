import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import './Vitals.css'

const Vitals = () => {
  const [currentVitals, setCurrentVitals] = useState({
    bloodPressure: "120/80",
    bloodSugar: "95",
    weight: "72",
    note: ""
  })

  const [vitalsHistory, setVitalsHistory] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...currentVitals })
  const [showSuccessMessage, setShowSuccessMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState('')

  useEffect(() => {
    // Load vitals history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('vitalsHistory') || '[]')
    setVitalsHistory(savedHistory)

    // Load current vitals from localStorage
    const savedCurrent = JSON.parse(localStorage.getItem('currentVitals'))
    if (savedCurrent) {
      setCurrentVitals(savedCurrent)
      setEditData(savedCurrent)
    }
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...currentVitals })
  }

  const handleSaveAndAdd = () => {
    if (!editData.bloodPressure || !editData.bloodSugar || !editData.weight) {
      setShowErrorMessage('Please fill Blood Pressure, Blood Sugar, and Weight')
      setTimeout(() => setShowErrorMessage(''), 3000)
      return
    }

    setCurrentVitals(editData)
    localStorage.setItem('currentVitals', JSON.stringify(editData))

    const now = new Date()
    const vitalsEntry = {
      id: Date.now(),
      ...editData,
      date: now.toLocaleDateString('en-US'),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const updatedHistory = [vitalsEntry, ...vitalsHistory]
    setVitalsHistory(updatedHistory)
    localStorage.setItem('vitalsHistory', JSON.stringify(updatedHistory))

    setIsEditing(false)
    setShowSuccessMessage('Vitals updated and saved to history successfully!')
    setTimeout(() => setShowSuccessMessage(''), 3000)
  }

  const handleSaveOnly = () => {
    if (!editData.bloodPressure || !editData.bloodSugar || !editData.weight) {
      setShowErrorMessage('Please fill Blood Pressure, Blood Sugar, and Weight')
      setTimeout(() => setShowErrorMessage(''), 3000)
      return
    }

    setCurrentVitals(editData)
    localStorage.setItem('currentVitals', JSON.stringify(editData))

    setIsEditing(false)
    setShowSuccessMessage('Current vitals updated successfully!')
    setTimeout(() => setShowSuccessMessage(''), 3000)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ ...currentVitals })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleDeleteVitals = (id) => {
    const updatedHistory = vitalsHistory.filter(entry => entry.id !== id)
    setVitalsHistory(updatedHistory)
    localStorage.setItem('vitalsHistory', JSON.stringify(updatedHistory))
    setShowSuccessMessage('Vitals entry deleted successfully!')
    setTimeout(() => setShowSuccessMessage(''), 3000)
  }

  return (
    <Layout>
      <div className="vitals-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="vitals-container">
            {/* Success/Error Messages */}
            {showSuccessMessage && (
              <div className="success-message">
                ✓ {showSuccessMessage}
              </div>
            )}
            {showErrorMessage && (
              <div className="error-message">
                ⚠️ {showErrorMessage}
              </div>
            )}

            <div className="vitals-header">
              <h1>Health Vitals</h1>
              <p>Track your Blood Pressure, Blood Sugar, and Weight</p>
              {!isEditing && (
                <button className="edit-vitals-btn" onClick={handleEdit}>
                  ✏️ Edit Vitals
                </button>
              )}
            </div>

            <div className="current-vitals-section">
              <h2>Current Vitals</h2>
              <div className="vitals-grid">
                <div className="vital-card">
                  {/* <div className="vital-icon">💓</div> */}
                  <div className="vital-info">
                    <h3>Blood Pressure</h3>
                    {isEditing ? (
                      <input
                        type="text"
                        name="bloodPressure"
                        value={editData.bloodPressure}
                        onChange={handleChange}
                        className="vital-input"
                        placeholder="120/80"
                      />
                    ) : (
                      <p className="vital-value">{currentVitals.bloodPressure}</p>
                    )}
                    <span>mmHg</span>
                  </div>
                </div>

                <div className="vital-card">
                  {/* <div className="vital-icon">🍬</div> */}
                  <div className="vital-info">
                    <h3>Blood Sugar</h3>
                    {isEditing ? (
                      <input
                        type="number"
                        name="bloodSugar"
                        value={editData.bloodSugar}
                        onChange={handleChange}
                        className="vital-input"
                        placeholder="95"
                      />
                    ) : (
                      <p className="vital-value">{currentVitals.bloodSugar}</p>
                    )}
                    <span>mg/dL</span>
                  </div>
                </div>

                <div className="vital-card">
                  {/* <div className="vital-icon">⚖️</div> */}
                  <div className="vital-info">
                    <h3>Weight</h3>
                    {isEditing ? (
                      <input
                        type="number"
                        name="weight"
                        value={editData.weight}
                        onChange={handleChange}
                        className="vital-input"
                        placeholder="72"
                      />
                    ) : (
                      <p className="vital-value">{currentVitals.weight}</p>
                    )}
                    <span>kg</span>
                  </div>
                </div>

                <div className="vital-card note-card">
                  {/* <div className="vital-icon">📝</div> */}
                  <div className="vital-info">
                    <h3>Note</h3>
                    {isEditing ? (
                      <textarea
                        name="note"
                        value={editData.note}
                        onChange={handleChange}
                        className="vital-textarea"
                        rows="2"
                        placeholder="Add any notes..."
                      />
                    ) : (
                      <p className="vital-note">{currentVitals.note || "No notes added"}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="edit-actions">
                  <button className="save-only-btn" onClick={handleSaveOnly}>
                    Save Changes
                  </button>
                  <button className="save-add-btn" onClick={handleSaveAndAdd}>
                    Save & Add to History
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </div>


            {vitalsHistory.length > 0 && (
              <div className="vitals-history-section">
                <h2>Vitals History</h2>
                <div className="history-table">
                  <div className="table-header2">
                    <span>Date & Time</span>
                    <span>BP</span>
                    <span>Sugar</span>
                    <span>Weight</span>
                    <span>Note</span>
                    <span className="action-header">Action</span>
                  </div>
                  <div className="table-body">
                    {vitalsHistory.map(entry => (
                      <div className="table-row2" key={entry.id}>
                        <span className="date-time">{entry.date} {entry.time}</span>
                        <span>{entry.bloodPressure || '-'}</span>
                        <span>{entry.bloodSugar || '-'}</span>
                        <span>{entry.weight || '-'}</span>
                        <span className="note-text">{entry.note || '-'}</span>
                        <div className="action-cell">
                          <button
                            className="delete-history-btn"
                            onClick={() => handleDeleteVitals(entry.id)}
                            title="Delete entry"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Vitals