import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import API from '../services/api'
import './AIInsights.css'

const AIInsights = () => {
  const [reports, setReports] = useState([])
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await API.get('/reports')
      if (response.data.success) {
        const analyzedReports = response.data.data.filter(r => r.status === 'Analyzed')
        setReports(analyzedReports)
        
        // Generate insights from analyzed reports
        const insightsData = analyzedReports.map(report => ({
          id: report._id,
          title: report.title,
          summary: report.aiAnalysis?.summary || 'Analysis in progress',
          findings: report.aiAnalysis?.findings || ['No findings available'],
          recommendations: report.aiAnalysis?.recommendations || ['Consult your doctor'],
          insights: report.aiAnalysis?.insights || 'Regular health monitoring recommended',
          date: new Date(report.createdAt).toLocaleDateString()
        }))
        setInsights(insightsData)
        
        if (analyzedReports.length > 0) {
          setChatHistory([{
            type: 'ai',
            message: `Hello! I'm your AI Health Assistant. I've analyzed ${analyzedReports.length} report(s). Select a report to view detailed analysis or ask me any health-related questions.`
          }])
        } else {
          setChatHistory([{
            type: 'ai',
            message: "Hello! I'm your AI Health Assistant. Upload a medical report in the Report Dashboard, and I'll analyze it for you!"
          }])
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      setMessage({ type: 'error', text: 'Failed to load insights' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleReportClick = (report) => {
    setSelectedReport(report)
    
    setChatHistory(prev => [
      ...prev,
      { type: 'ai', message: `📊 Analyzing ${report.title}...` },
      { type: 'ai', message: `📝 Summary: ${report.summary}` },
      { type: 'ai', message: `🔍 Key Findings:\n${report.findings.map(f => `• ${f}`).join('\n')}` },
      { type: 'ai', message: `💡 Recommendations:\n${report.recommendations.map(r => `• ${r}`).join('\n')}` },
      { type: 'ai', message: `✨ Health Insight: ${report.insights}` },
      { type: 'ai', message: 'You can ask me more questions about this report!' }
    ])
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return
    
    const userQuestion = chatMessage
    setChatHistory(prev => [...prev, { type: 'user', message: userQuestion }])
    setChatMessage('')
    setIsTyping(true)
    
    setTimeout(() => {
      let response = "Based on the available health data, "
      
      if (selectedReport) {
        response += `your ${selectedReport.title} shows ${selectedReport.summary.toLowerCase()}. `
        response += `Recommendations include: ${selectedReport.recommendations.join(', ')}. `
      } else if (insights.length > 0) {
        response += `your recent health reports indicate ${insights[0].insights.toLowerCase()}. `
      } else {
        response += "I recommend uploading your medical reports for detailed analysis. "
      }
      
      response += "Would you like me to explain any specific aspect of your health data?"
      
      setChatHistory(prev => [...prev, { type: 'ai', message: response }])
      setIsTyping(false)
    }, 1000)
  }

  const handleDownloadReport = async (reportId, title) => {
    try {
      const response = await API.get(`/reports/${reportId}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_')}_analysis.txt`)
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

  if (loading) {
    return (
      <Layout>
        <div className="ai-insights-page">
          <div className="reports-layout">
            <ReportSidebar />
            <div className="ai-insights-container">
              <div className="loading-spinner">Loading AI insights...</div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="ai-insights-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="ai-insights-container">
            <div className="ai-insights-header">
              <h1>AI Health Insights</h1>
              <p>AI-powered analysis of your medical reports</p>
            </div>

            {message.text && (
              <div className={`message-alert ${message.type}`}>
                {message.type === 'success' ? '✓' : '⚠️'} {message.text}
              </div>
            )}

            {insights.length === 0 ? (
              <div className="no-reports-message">
                <p>No analyzed reports available</p>
                <p className="empty-hint">Upload a report in the Report Dashboard to get AI analysis</p>
              </div>
            ) : (
              <>
                <div className="reports-list-sidebar">
                  <div className="reports-header">
                    <h3>Your Analyzed Reports</h3>
                    <span className="report-count">{insights.length} reports</span>
                  </div>
                  <div className="reports-buttons">
                    {insights.map(report => (
                      <button 
                        key={report.id}
                        className={`report-btn ${selectedReport?.id === report.id ? 'active' : ''}`}
                        onClick={() => handleReportClick(report)}
                      >
                        <span className="report-name">{report.title}</span>
                        <span className="report-date">{report.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ai-chat-section">
                  <h3>Ask AI Health Assistant</h3>
                  <div className="chat-container">
                    <div className="chat-history">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.type}`}>
                          <div className="message-avatar">
                            {msg.type === 'ai' ? '🤖' : '👤'}
                          </div>
                          <div className="message-text">
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="chat-message ai typing">
                          <div className="message-avatar">🤖</div>
                          <div className="message-text">Typing...</div>
                        </div>
                      )}
                    </div>
                    <div className="chat-input-area">
                      <input 
                        type="text" 
                        placeholder={selectedReport ? "Ask about this report..." : "Select a report to ask questions..."}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={insights.length === 0}
                      />
                      <button onClick={handleSendMessage} disabled={insights.length === 0}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>

                <div className="insights-grid">
                  {insights.map(insight => (
                    <div key={insight.id} className="insight-card">
                      <div className="insight-header">
                        <h3>{insight.title}</h3>
                        <div className="insight-actions">
                          <button 
                            className="download-insight-btn"
                            onClick={() => handleDownloadReport(insight.id, insight.title)}
                          >
                            📥 Download
                          </button>
                        </div>
                      </div>
                      <p className="insight-text">{insight.summary}</p>
                      <div className="insight-recommendation">
                        <p className="recommendation-title">Key Findings</p>
                        <ul>
                          {insight.findings.map((finding, idx) => (
                            <li key={idx}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="insight-recommendation">
                        <p className="recommendation-title">Recommendations</p>
                        <ul>
                          {insight.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="insight-insight">
                        <strong>💡 Health Insight:</strong> {insight.insights}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AIInsights