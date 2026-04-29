import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import API from '../services/api'
import './ReportDashboard.css'

const ReportDashboard = () => {
  const [reports, setReports] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)

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
      setShowErrorMessage('Failed to load reports')
      setTimeout(() => setShowErrorMessage(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    setShowErrorMessage('File size must be less than 10MB');
    setTimeout(() => setShowErrorMessage(''), 3000);
    return;
  }
  
  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    setShowErrorMessage('Invalid file type. Please upload PDF, JPG, PNG, or TXT files.');
    setTimeout(() => setShowErrorMessage(''), 3000);
    return;
  }
  
  setUploading(true);
  setUploadProgress('Uploading file...');
  setShowSuccessMessage('');
  setShowErrorMessage('');
  
  const formData = new FormData();
  formData.append('report', file);
  formData.append('title', file.name.replace(/\.[^/.]+$/, ""));
  formData.append('type', file.type.includes('image') ? 'Image' : file.type.includes('pdf') ? 'PDF' : 'Document');
  
  try {
    const response = await API.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
      setUploadProgress('AI analyzing report...');
      setTimeout(() => {
        setUploadProgress('');
        setUploading(false);
        setShowSuccessMessage(`"${file.name}" uploaded successfully! AI analysis started.`);
        fetchReports();
        setTimeout(() => setShowSuccessMessage(''), 5000);
      }, 1500);
    }
    e.target.value = '';
  } catch (error) {
    console.error('Upload failed:', error);
    setUploading(false);
    setUploadProgress('');
    const errorMsg = error.response?.data?.message || `Failed to upload "${file.name}". Please try again.`;
    setShowErrorMessage(errorMsg);
    setTimeout(() => setShowErrorMessage(''), 5000);
    e.target.value = '';
  }
};

  const handleDownload = async (reportId, title) => {
    try {
      const response = await API.get(`/reports/${reportId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_')}_report.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setShowSuccessMessage('Report downloaded successfully!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
    } catch (error) {
      setShowErrorMessage('Failed to download report');
      setTimeout(() => setShowErrorMessage(''), 3000);
    }
  };

  const totalReports = reports.length;
  const analyzedReports = reports.filter(r => r.status === 'Analyzed').length;
  const recentReports = reports.slice(0, 5);

  const getCurrentMonthReports = () => {
    const now = new Date();
    return reports.filter(r => {
      const reportDate = new Date(r.createdAt);
      return reportDate.getMonth() === now.getMonth() && 
             reportDate.getFullYear() === now.getFullYear();
    }).length;
  };

  if (loading) {
    return (
      <Layout>
        <div className="report-dashboard-page">
          <div className="reports-layout">
            <ReportSidebar />
            <div className="dashboard-container">
              <div className="loading-spinner">Loading reports...</div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="report-dashboard-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h1>Report Dashboard</h1>
              <p>Upload and manage your medical reports</p>
            </div>

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

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <p className="stat-label">Total Reports</p>
                  <h2 className="stat-number">{totalReports}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <p className="stat-label">Analyzed</p>
                  <h2 className="stat-number">{analyzedReports}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <p className="stat-label">AI Insights</p>
                  <h2 className="stat-number">{reports.length}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <p className="stat-label">This Month</p>
                  <h2 className="stat-number">{getCurrentMonthReports()}</h2>
                </div>
              </div>
            </div>

            <div className="upload-section">
              <div className="upload-content">
                <h3>Upload Medical Report</h3>
                <p>Upload your medical reports for AI-powered analysis</p>
                <div className="upload-area">
                  <input 
                    type="file" 
                    id="reportUpload" 
                    accept=".pdf,.jpg,.png,.jpeg,.txt"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="reportUpload" className="upload-btn" style={{ opacity: uploading ? 0.6 : 1 }}>
                    {uploading ? '⏳ Analyzing...' : '📁 Choose File'}
                  </label>
                  {uploadProgress && <p className="upload-progress">{uploadProgress}</p>}
                  <p className="upload-hint">Supported formats: PDF, JPG, PNG, TXT (Max 10MB)</p>
                </div>
              </div>
            </div>

            <div className="recent-reports">
              <div className="recent-header">
                <h3>Recent Reports</h3>
                {recentReports.length > 0 && (
                  <span className="report-count">{recentReports.length} reports</span>
                )}
              </div>
              {recentReports.length === 0 ? (
                <div className="empty-state">
                  <p>No reports uploaded yet</p>
                  <p className="empty-hint">Click "Choose File" to upload your first report</p>
                </div>
              ) : (
                <div className="reports-list">
                  {recentReports.map((reportItem) => (
                    <div className="report-item" key={reportItem._id}>
                      <div className="report-icon">📄</div>
                      <div className="report-info">
                        <div className="report-title">{reportItem.title}</div>
                        <div className="report-meta">
                          {new Date(reportItem.createdAt).toLocaleDateString()} • {reportItem.type}
                        </div>
                      </div>
                      <div className="report-status">{reportItem.status || 'Analyzed'}</div>
                      <button 
                        className="download-btn" 
                        onClick={() => handleDownload(reportItem._id, reportItem.title)}
                      >
                        📥 Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDashboard;