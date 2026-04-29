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
  const [analyzingReports, setAnalyzingReports] = useState([])

  useEffect(() => {
    fetchReports()
  }, [])

  // Auto-refresh for pending reports
  useEffect(() => {
    let interval
    if (analyzingReports.length > 0) {
      interval = setInterval(() => {
        fetchReports()
      }, 5000) // Refresh every 5 seconds
    }
    return () => clearInterval(interval)
  }, [analyzingReports.length])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await API.get('/reports')
      if (response.data.success) {
        const allReports = response.data.data || []
        
        // Separate pending and analyzed reports
        const pendingReports = allReports.filter(r => r.status !== 'Analyzed')
        const analyzedReports = allReports.filter(r => r.status === 'Analyzed')
        
        setReports(analyzedReports)
        setAnalyzingReports(pendingReports)
        
        // Auto-analyze pending reports
        if (pendingReports.length > 0) {
          setMessage({ 
            type: 'info', 
            text: `${pendingReports.length} report(s) are being analyzed by AI...` 
          })
          
          for (const report of pendingReports) {
            await triggerAIAnalysis(report._id, report.title)
          }
        }
        
        // Generate insights from analyzed reports
        const insightsData = analyzedReports.map(report => ({
          id: report._id,
          title: report.title,
          summary: report.aiAnalysis?.summary || report.summary || 'Analysis in progress',
          findings: report.aiAnalysis?.findings || ['No findings available'],
          recommendations: report.aiAnalysis?.recommendations || ['Consult your doctor'],
          insights: report.aiAnalysis?.insights || 'Regular health monitoring recommended',
          explanation_en: report.explanation_en || '',
          explanation_ro: report.explanation_ro || '',
          date: new Date(report.createdAt).toLocaleDateString()
        }))
        setInsights(insightsData)
        
        // Update chat history based on available reports
        if (analyzedReports.length > 0 && chatHistory.length === 0) {
          setChatHistory([{
            type: 'ai',
            message: `Hello! I'm your AI Health Assistant. I've analyzed ${analyzedReports.length} report(s). Select a report to view detailed analysis or ask me any health-related questions.`
          }])
        } else if (pendingReports.length > 0 && chatHistory.length === 0) {
          setChatHistory([{
            type: 'ai',
            message: `Hello! I'm your AI Health Assistant. I'm currently analyzing ${pendingReports.length} report(s). Please wait a moment and refresh the page.`
          }])
        } else if (analyzedReports.length === 0 && pendingReports.length === 0 && chatHistory.length === 0) {
          setChatHistory([{
            type: 'ai',
            message: "Hello! I'm your AI Health Assistant. Upload a medical report in the Report Dashboard, and I'll analyze it for you!"
          }])
        }
        
        // Clear info message after 3 seconds
        setTimeout(() => {
          if (message.type === 'info') {
            setMessage({ type: '', text: '' })
          }
        }, 3000)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      setMessage({ type: 'error', text: 'Failed to load insights' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const triggerAIAnalysis = async (reportId, title) => {
    try {
      const response = await API.post(`/reports/${reportId}/analyze`)
      if (response.data.success) {
        console.log(`Report "${title}" analyzed successfully`)
      }
    } catch (error) {
      console.error(`Failed to analyze report "${title}":`, error)
    }
  }

  const handleReportClick = async (report) => {
    setSelectedReport(report)
    
    setChatHistory(prev => [
      ...prev,
      { type: 'ai', message: `📊 Loading analysis for ${report.title}...` }
    ])
    
    // Fetch latest analysis from backend
    try {
      const response = await API.get(`/reports/${report.id}`)
      if (response.data.success) {
        const latestReport = response.data.data
        const updatedReport = {
          ...report,
          summary: latestReport.aiAnalysis?.summary || latestReport.summary || report.summary,
          findings: latestReport.aiAnalysis?.findings || report.findings,
          recommendations: latestReport.aiAnalysis?.recommendations || report.recommendations,
          insights: latestReport.aiAnalysis?.insights || report.insights,
          explanation_en: latestReport.explanation_en || report.explanation_en,
          explanation_ro: latestReport.explanation_ro || report.explanation_ro
        }
        
        setSelectedReport(updatedReport)
        
        // Remove the loading message and add actual analysis
        setChatHistory(prev => {
          const newHistory = [...prev]
          newHistory.pop() // Remove loading message
          return [
            ...newHistory,
            { type: 'ai', message: `📝 Summary: ${updatedReport.summary}` },
            { type: 'ai', message: `🔍 Key Findings:\n${updatedReport.findings.map(f => `• ${f}`).join('\n')}` },
            { type: 'ai', message: `💡 Recommendations:\n${updatedReport.recommendations.map(r => `• ${r}`).join('\n')}` },
            { type: 'ai', message: `✨ Health Insight: ${updatedReport.insights}` },
            ...(updatedReport.explanation_en ? [{ type: 'ai', message: `📖 English Explanation:\n${updatedReport.explanation_en}` }] : []),
            ...(updatedReport.explanation_ro ? [{ type: 'ai', message: `🕌 Roman Urdu Explanation:\n${updatedReport.explanation_ro}` }] : []),
            { type: 'ai', message: 'You can ask me more questions about this report!' }
          ]
        })
      } else {
        setChatHistory(prev => {
          const newHistory = [...prev]
          newHistory.pop()
          return [
            ...newHistory,
            { type: 'ai', message: `⚠️ Unable to load complete analysis for ${report.title}. Please try again.` }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching report details:', error)
      setChatHistory(prev => {
        const newHistory = [...prev]
        newHistory.pop()
        return [
          ...newHistory,
          { type: 'ai', message: `⚠️ Error loading analysis. Please refresh and try again.` }
        ]
      })
    }
  }

  const generateAIResponse = (question, report) => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('summary') || lowerQuestion.includes('overview') || lowerQuestion.includes('what is about')) {
      return `📊 Report Summary for ${report.title}:\n\n${report.summary}\n\nWould you like more details about specific findings?`
    }
    
    if (lowerQuestion.includes('finding') || lowerQuestion.includes('result') || lowerQuestion.includes('abnormal') || lowerQuestion.includes('show')) {
      return `🔍 Key Findings from ${report.title}:\n${report.findings.map(f => `• ${f}`).join('\n')}\n\nDo you need clarification on any of these findings?`
    }
    
    if (lowerQuestion.includes('recommend') || lowerQuestion.includes('advice') || lowerQuestion.includes('suggestion') || lowerQuestion.includes('should i do')) {
      return `💡 Recommendations based on your ${report.title}:\n${report.recommendations.map(r => `• ${r}`).join('\n')}\n\nPlease consult with your doctor for personalized medical advice.`
    }
    
    if (lowerQuestion.includes('insight') || lowerQuestion.includes('health') || lowerQuestion.includes('meaning') || lowerQuestion.includes('indicate')) {
      return `✨ Health Insight: ${report.insights}\n\nRegular monitoring and follow-up with your healthcare provider is recommended for optimal health management.`
    }
    
    if (lowerQuestion.includes('normal') || lowerQuestion.includes('range') || lowerQuestion.includes('good') || lowerQuestion.includes('bad')) {
      return `📊 Based on the analysis, most parameters in ${report.title} are within normal ranges. However, always consult with your healthcare provider for interpretation of results.`
    }
    
    if (lowerQuestion.includes('doctor') || lowerQuestion.includes('consult') || lowerQuestion.includes('appointment') || lowerQuestion.includes('specialist')) {
      return `👨‍⚕️ While the AI provides insights, it's important to consult with a qualified healthcare professional for personalized medical advice. Would you like to browse doctors in our directory?`
    }
    
    if (lowerQuestion.includes('explain') || lowerQuestion.includes('tell me about')) {
      if (report.explanation_en) {
        return `📖 Here's a simple explanation:\n\n${report.explanation_en}\n\nDoes this help clarify things for you?`
      }
      return `I'd be happy to explain. Based on the report, ${report.summary.toLowerCase()} Would you like me to elaborate on any specific aspect?`
    }
    
    if (lowerQuestion.includes('urdu') || lowerQuestion.includes('roman')) {
      if (report.explanation_ro) {
        return `🕌 Roman Urdu Explanation:\n\n${report.explanation_ro}\n\nKya aap is ki mazeed tashreeh chahte hain?`
      }
      return `I apologize, but the Roman Urdu translation for this report is not available at the moment.`
    }
    
    if (lowerQuestion.includes('thank')) {
      return `You're welcome! I'm here to help with any health-related questions you have about your medical reports. Is there anything specific you'd like to know?`
    }
    
    return `Thank you for your question about ${report.title}. Based on the analysis, ${report.summary.toLowerCase()} For specific medical concerns, please consult with your healthcare provider. Is there anything specific about the findings or recommendations you'd like me to explain further?`
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return
    
    const userQuestion = chatMessage
    setChatHistory(prev => [...prev, { type: 'user', message: userQuestion }])
    setChatMessage('')
    setIsTyping(true)
    
    // Simulate AI thinking time
    setTimeout(() => {
      let response = ""
      
      if (selectedReport) {
        response = generateAIResponse(userQuestion, selectedReport)
      } else if (insights.length > 0) {
        response = `Based on your ${insights.length} health report(s), ${insights[0].insights.toLowerCase()} Would you like me to analyze a specific report in detail? Just select a report from the list above.`
      } else {
        response = "I recommend uploading your medical reports for detailed analysis. You can upload PDF, JPG, or PNG files in the Report Dashboard. Once uploaded, I'll analyze them and provide insights!"
      }
      
      setChatHistory(prev => [...prev, { type: 'ai', message: response }])
      setIsTyping(false)
    }, 1500)
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

  const handleRefresh = () => {
    fetchReports()
    setMessage({ type: 'info', text: 'Refreshing reports...' })
    setTimeout(() => setMessage({ type: '', text: '' }), 2000)
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
              <div>
                <h1>AI Health Insights</h1>
                <p>AI-powered analysis of your medical reports</p>
              </div>
              <button className="refresh-btn" onClick={handleRefresh}>
                🔄 Refresh Reports
              </button>
            </div>

            {message.text && (
              <div className={`message-alert ${message.type}`}>
                {message.type === 'success' ? '✓' : message.type === 'info' ? 'ℹ️' : '⚠️'} {message.text}
              </div>
            )}

            {analyzingReports.length > 0 && (
              <div className="analyzing-status">
                🤖 AI is analyzing {analyzingReports.length} report(s)...
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            )}

            {insights.length === 0 && analyzingReports.length === 0 ? (
              <div className="no-reports-message">
                <p>No analyzed reports available</p>
                <p className="empty-hint">Upload a report in the Report Dashboard to get AI analysis</p>
              </div>
            ) : insights.length === 0 && analyzingReports.length > 0 ? (
              <div className="no-reports-message">
                <p>AI is analyzing your reports...</p>
                <p className="empty-hint">Please wait a moment and click refresh</p>
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
                            {msg.message.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < msg.message.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="chat-message ai typing">
                          <div className="message-avatar">🤖</div>
                          <div className="message-text">
                            <span className="typing-dots">Thinking</span>
                          </div>
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
                      <button onClick={handleSendMessage} disabled={insights.length === 0 || !chatMessage.trim()}>
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
                        <p className="recommendation-title">🔍 Key Findings</p>
                        <ul>
                          {insight.findings.map((finding, idx) => (
                            <li key={idx}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="insight-recommendation">
                        <p className="recommendation-title">💡 Recommendations</p>
                        <ul>
                          {insight.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="insight-insight">
                        <strong>✨ Health Insight:</strong> {insight.insights}
                      </div>
                      {insight.explanation_en && (
                        <div className="insight-explanation">
                          <strong>📖 English Explanation:</strong>
                          <p>{insight.explanation_en}</p>
                        </div>
                      )}
                      {insight.explanation_ro && (
                        <div className="insight-explanation insight-urdu">
                          <strong>🕌 Roman Urdu Explanation:</strong>
                          <p>{insight.explanation_ro}</p>
                        </div>
                      )}
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