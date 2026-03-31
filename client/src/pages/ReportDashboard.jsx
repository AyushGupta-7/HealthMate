import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import { analyzeMedicalReport } from '../services/aiService'
import './ReportDashboard.css'

const ReportDashboard = () => {
  const [reports, setReports] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState('')

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('medicalReports') || '[]')
    setReports(savedReports)
  }, [])

  const extractFileContent = (file) => {
    return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf') {
        resolve(`PDF Report: ${file.name}\nThis appears to be a medical document. Please ensure the file is readable.`);
      } else if (file.type.startsWith('image/')) {
        resolve(`Image Report: ${file.name}\nThis is a medical image report. Visual analysis would require OCR technology.`);
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        resolve(`Medical Report: ${file.name}`);
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setUploadProgress('Reading file...');
      setShowSuccessMessage('');
      setShowErrorMessage('');
      
      try {
        // Extract file content
        setUploadProgress('Extracting content...');
        const fileContent = await extractFileContent(file);
        
        // Send to AI for analysis
        setUploadProgress('AI analyzing report...');
        const analysis = await analyzeMedicalReport(file.name, fileContent, file.type);
        
        // Ensure analysis has all required fields
        const safeAnalysis = {
          summary: analysis?.summary || 'No summary available.',
          findings: analysis?.findings || ['No findings available'],
          recommendations: analysis?.recommendations || ['Consult with your doctor for personalized advice'],
          insights: analysis?.insights || 'Regular health monitoring is recommended.'
        };
        
        // Create new report object
        const newReport = {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          date: new Date().toLocaleDateString('en-US'),
          type: file.type.includes('image') ? 'Image' : file.type.includes('pdf') ? 'PDF' : 'Document',
          status: 'Analyzed',
          fileUrl: URL.createObjectURL(file),
          fileContent: fileContent.substring(0, 1000),
          aiAnalysis: safeAnalysis
        };
        
        const updatedReports = [newReport, ...reports];
        setReports(updatedReports);
        localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
        
        setUploadProgress('');
        setUploading(false);
        setShowSuccessMessage(`✓ "${file.name}" uploaded and analyzed successfully! View insights in AI Insights.`);
        setTimeout(() => setShowSuccessMessage(''), 5000);
        
        // Clear file input
        e.target.value = '';
      } catch (error) {
        console.error('Upload failed:', error);
        setUploading(false);
        setUploadProgress('');
        setShowErrorMessage(`✗ Failed to analyze "${file.name}". Please try again.`);
        setTimeout(() => setShowErrorMessage(''), 5000);
        
        // Clear file input
        e.target.value = '';
      }
    }
  };

  const totalReports = reports.length;
  const analyzedReports = reports.filter(r => r.status === 'Analyzed').length;
  const recentReports = reports.slice(0, 5);

  return (
    <Layout>
      <div className="report-dashboard-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h1>Report Dashboard</h1>
              <p>Upload medical reports for AI-powered analysis</p>
            </div>

            {/* Success/Error Messages */}
            {showSuccessMessage && (
              <div className="success-message">
                {showSuccessMessage}
              </div>
            )}
            {showErrorMessage && (
              <div className="error-message">
                {showErrorMessage}
              </div>
            )}

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-info">
                  <h3>Total Reports</h3>
                  <p className="stat-number">{totalReports}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Analyzed</h3>
                  <p className="stat-number">{analyzedReports}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🤖</div>
                <div className="stat-info">
                  <h3>AI Insights</h3>
                  <p className="stat-number">{reports.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>This Month</h3>
                  <p className="stat-number">{reports.filter(r => {
                    const reportDate = new Date(r.date);
                    const now = new Date();
                    return reportDate.getMonth() === now.getMonth();
                  }).length}</p>
                </div>
              </div>
            </div>

            <div className="upload-section">
              <h3>Upload New Report</h3>
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
                <p>Supported: PDF, JPG, PNG, TXT (Max 10MB)</p>
                <p className="upload-note">Reports will be analyzed by AI for health insights</p>
              </div>
            </div>

            <div className="recent-reports">
              <h2>Recent Reports</h2>
              {recentReports.length === 0 ? (
                <div className="no-reports-message">
                  <p>No reports uploaded yet. Click "Choose File" to upload your first report.</p>
                </div>
              ) : (
                <div className="reports-list">
                  {recentReports.map(report => (
                    <div className="report-item" key={report.id}>
                      <div className="report-icon">📋</div>
                      <div className="report-info">
                        <h4>{report.title}</h4>
                        <p>{report.date}</p>
                      </div>
                      <span className="report-status analyzed">
                        Analyzed
                      </span>
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