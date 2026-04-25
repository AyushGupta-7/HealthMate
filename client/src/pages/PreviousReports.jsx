import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import API from '../services/api'
import './PreviousReports.css'

const PreviousReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await API.get('/reports')
      if (response.data.success) {
        setReports(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      setMessage({ type: 'error', text: 'Failed to load reports' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    return report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           report.type.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleViewReport = (report) => {
    setSelectedReport(report)
  }

  const closeModal = () => {
    setSelectedReport(null)
  }

  const handleDownload = async (report) => {
    try {
      const response = await API.get(`/reports/${report._id}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${report.title.replace(/[^a-z0-9]/gi, '_')}_report.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: 'Report downloaded successfully!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to download report' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleDeleteClick = (reportId) => {
    setShowDeleteConfirm(reportId)
  }

  const confirmDelete = async (reportId) => {
    try {
      await API.delete(`/reports/${reportId}`)
      setMessage({ type: 'success', text: 'Report deleted successfully!' })
      fetchReports()
      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport(null)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete report' })
    } finally {
      setShowDeleteConfirm(null)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  const getSafeAnalysis = (report) => {
    return {
      summary: report.aiAnalysis?.summary || 'Analysis in progress. Please check back later.',
      findings: report.aiAnalysis?.findings || ['No findings available yet'],
      recommendations: report.aiAnalysis?.recommendations || ['Please consult with your doctor for personalized advice'],
      insights: report.aiAnalysis?.insights || 'Stay healthy with regular checkups'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="previous-reports-page">
          <div className="reports-layout">
            <ReportSidebar />
            <div className="reports-container">
              <div className="loading-spinner">Loading reports...</div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="previous-reports-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="reports-container">
            <div className="reports-header">
              <h1>Previous Reports</h1>
              <p>View all your uploaded medical reports with AI analysis</p>
            </div>

            {message.text && (
              <div className={`message-alert ${message.type}`}>
                {message.type === 'success' ? '✓' : '⚠️'} {message.text}
              </div>
            )}

            <div className="reports-controls">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search by report name or type..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="no-reports">
                <p>No reports uploaded yet.</p>
                <button onClick={() => window.location.href = '/report-dashboard'}>
                  Upload a Report
                </button>
              </div>
            ) : (
              <div className="reports-table">
                <div className="table-header">
                  <span>Report Name</span>
                  <span>Date</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                <div className="table-body">
                  {filteredReports.map(report => (
                    <div className="table-row" key={report._id}>
                      <span className="report-title">{report.title}</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      <span>{report.type}</span>
                      <span className={`status-badge ${report.status === 'Analyzed' ? 'analyzed' : 'pending'}`}>
                        {report.status || 'Analyzed'}
                      </span>
                      <div className="action-buttons">
                        <button className="view-btn" onClick={() => handleViewReport(report)}>
                          View
                        </button>
                        <button className="download-btn" onClick={() => handleDownload(report)}>
                          📥 Download
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteClick(report._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredReports.length === 0 && reports.length > 0 && (
              <div className="no-reports">
                <p>No reports found matching "{searchTerm}".</p>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="report-modal-overlay" onClick={cancelDelete}>
                <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="confirm-modal-header">
                    <span className="confirm-icon">🗑️</span>
                    <h3>Delete Report</h3>
                  </div>
                  <div className="confirm-modal-body">
                    <p>Are you sure you want to delete this report?</p>
                    <p className="confirm-warning">This action cannot be undone.</p>
                  </div>
                  <div className="confirm-modal-footer">
                    <button className="confirm-yes" onClick={() => confirmDelete(showDeleteConfirm)}>
                      Yes, Delete
                    </button>
                    <button className="confirm-no" onClick={cancelDelete}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Report Modal with AI Analysis */}
            {selectedReport && (
              <div className="report-modal-overlay" onClick={closeModal}>
                <div className="report-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{selectedReport.title}</h2>
                    <button className="close-btn" onClick={closeModal}>×</button>
                  </div>
                  <div className="modal-body">
                    <div className="report-detail">
                      <label>File Name:</label>
                      <span>{selectedReport.fileName}</span>
                    </div>
                    <div className="report-detail">
                      <label>Date Uploaded:</label>
                      <span>{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="report-detail">
                      <label>Report Type:</label>
                      <span>{selectedReport.type}</span>
                    </div>
                    
                    {(() => {
                      const analysis = getSafeAnalysis(selectedReport);
                      return (
                        <>
                          <div className="report-detail ai-section">
                            <label>🤖 AI Summary:</label>
                            <p>{analysis.summary}</p>
                          </div>
                          
                          <div className="report-detail ai-section">
                            <label>🔍 Key Findings:</label>
                            <ul>
                              {analysis.findings.map((finding, idx) => (
                                <li key={idx}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="report-detail ai-section">
                            <label>💡 Recommendations:</label>
                            <ul>
                              {analysis.recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="report-detail ai-section">
                            <label>✨ Health Insight:</label>
                            <p>{analysis.insights}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <div className="modal-footer">
                    <button className="download-btn" onClick={() => handleDownload(selectedReport)}>
                      📥 Download Report
                    </button>
                    <button className="delete-btn-modal" onClick={() => handleDeleteClick(selectedReport._id)}>
                      🗑️ Delete
                    </button>
                    <button className="close-modal-btn" onClick={closeModal}>
                      Close
                    </button>
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

export default PreviousReports