import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import API from '../services/api'
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
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCurrentVitals()
    fetchVitalsHistory()
  }, [])

  const fetchCurrentVitals = async () => {
    try {
      const response = await API.get('/vitals/current')
      if (response.data.success) {
        setCurrentVitals(response.data.data)
        setEditData(response.data.data)
      }
    } catch (error) {
      setShowErrorMessage('Failed to load current vitals')
      setTimeout(() => setShowErrorMessage(''), 3000)
    }
  }

  const fetchVitalsHistory = async () => {
    try {
      setLoading(true)
      const response = await API.get('/vitals/history')
      if (response.data.success) {
        setVitalsHistory(response.data.data)
      }
    } catch (error) {
      setShowErrorMessage('Failed to load vitals history')
      setTimeout(() => setShowErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...currentVitals })
  }

  const handleSaveOnly = async () => {
    if (!editData.bloodPressure || !editData.bloodSugar || !editData.weight) {
      setShowErrorMessage('Please fill Blood Pressure, Blood Sugar, and Weight')
      setTimeout(() => setShowErrorMessage(''), 3000)
      return
    }

    try {
      setIsSaving(true)
      const response = await API.put('/vitals/current', {
        bloodPressure: editData.bloodPressure,
        bloodSugar: editData.bloodSugar,
        weight: editData.weight,
        note: editData.note || ''
      })

      if (response.data.success) {
        setCurrentVitals(editData)
        setIsEditing(false)
        setShowSuccessMessage('✓ Current vitals updated successfully!')
        setTimeout(() => setShowSuccessMessage(''), 3000)
      }
    } catch (error) {
      setShowErrorMessage(error.response?.data?.message || 'Failed to update vitals')
      setTimeout(() => setShowErrorMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAndAdd = async () => {
    if (!editData.bloodPressure || !editData.bloodSugar || !editData.weight) {
      setShowErrorMessage('Please fill Blood Pressure, Blood Sugar, and Weight')
      setTimeout(() => setShowErrorMessage(''), 3000)
      return
    }

    try {
      setIsSaving(true)
      
      await API.put('/vitals/current', {
        bloodPressure: editData.bloodPressure,
        bloodSugar: editData.bloodSugar,
        weight: editData.weight,
        note: editData.note || ''
      })

      const now = new Date()
      const historyData = {
        bloodPressure: editData.bloodPressure,
        bloodSugar: editData.bloodSugar,
        weight: editData.weight,
        note: editData.note || '',
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      
      const historyResponse = await API.post('/vitals/history', historyData)

      if (historyResponse.data.success) {
        setCurrentVitals(editData)
        setIsEditing(false)
        const refreshedHistory = await API.get('/vitals/history')
        if (refreshedHistory.data.success) {
          setVitalsHistory(refreshedHistory.data.data)
        }
        setShowSuccessMessage('✓ Vitals updated and saved to history successfully!')
        setTimeout(() => setShowSuccessMessage(''), 3000)
      }
    } catch (error) {
      setShowErrorMessage(error.response?.data?.message || 'Failed to save vitals')
      setTimeout(() => setShowErrorMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ ...currentVitals })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleDeleteVitals = async (id) => {
    try {
      const response = await API.delete(`/vitals/history/${id}`)
      
      if (response.data.success) {
        setVitalsHistory(prevHistory => prevHistory.filter(entry => entry._id !== id))
        setShowSuccessMessage('✓ Vitals entry deleted successfully!')
        setTimeout(() => setShowSuccessMessage(''), 3000)
      } else {
        setShowErrorMessage(response.data.message || 'Failed to delete vitals entry')
        setTimeout(() => setShowErrorMessage(''), 3000)
      }
    } catch (error) {
      setShowErrorMessage('Failed to delete vitals entry')
      setTimeout(() => setShowErrorMessage(''), 3000)
    }
  }

  if (loading && vitalsHistory.length === 0) {
    return (
      <Layout>
        <div className="vitals-page">
          <div className="reports-layout">
            <ReportSidebar />
            <div className="vitals-container">
              <div className="loading-spinner">Loading vitals data...</div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="vitals-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="vitals-container">
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
                  <button 
                    className="save-only-btn" 
                    onClick={handleSaveOnly}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="save-add-btn" 
                    onClick={handleSaveAndAdd}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save & Add to History'}
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Confirmation Messages - Simple green/red text between sections */}
            {showSuccessMessage && (
              <div className="confirmation-msg success">{showSuccessMessage}</div>
            )}
            {showErrorMessage && (
              <div className="confirmation-msg error">{showErrorMessage}</div>
            )}

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
                      <div className="table-row2" key={entry._id}>
                        <span className="date-time">{entry.date} {entry.time}</span>
                        <span>{entry.bloodPressure || '-'}</span>
                        <span>{entry.bloodSugar || '-'}</span>
                        <span>{entry.weight || '-'}</span>
                        <span className="note-text">{entry.note || '-'}</span>
                        <div className="action-cell">
                          <button
                            className="delete-history-btn"
                            onClick={() => handleDeleteVitals(entry._id)}
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