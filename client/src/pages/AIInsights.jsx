import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ReportSidebar from '../components/ReportSidebar'
import { askAIAboutReport } from '../services/aiService'
import './AIInsights.css'

const AIInsights = () => {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('medicalReports') || '[]')
    setReports(savedReports)
    
    if (savedReports.length > 0) {
      setChatHistory([{
        type: 'ai',
        message: `Hello! I'm your AI Health Assistant. I see you have ${savedReports.length} report(s). Select a report to analyze or ask me any health-related questions!`
      }])
    } else {
      setChatHistory([{
        type: 'ai',
        message: "Hello! I'm your AI Health Assistant. Upload a medical report in the Report Dashboard, and I'll analyze it for you!"
      }])
    }
  }, [])

  const handleReportClick = async (report) => {
    setSelectedReport(report)
    
    // Safely access analysis data with fallbacks
    const summary = report.aiAnalysis?.summary || 'No summary available for this report.'
    const findings = report.aiAnalysis?.findings || ['No specific findings available']
    const recommendations = report.aiAnalysis?.recommendations || ['Please consult with your doctor for personalized advice']
    const insights = report.aiAnalysis?.insights || 'Regular health monitoring is recommended.'
    
    setChatHistory(prev => [
      ...prev,
      { type: 'ai', message: `I've analyzed ${report.title}. Here's what I found:` },
      { type: 'ai', message: `📊 Summary: ${summary}` },
      { type: 'ai', message: `🔍 Key Findings:\n${findings.map(f => `• ${f}`).join('\n')}` },
      { type: 'ai', message: `💡 Recommendations:\n${recommendations.map(r => `• ${r}`).join('\n')}` },
      { type: 'ai', message: `✨ Health Insight: ${insights}` },
      { type: 'ai', message: 'You can ask me more questions about this report!' }
    ]);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const userQuestion = chatMessage;
    setChatHistory(prev => [...prev, { type: 'user', message: userQuestion }]);
    setChatMessage('');
    setIsTyping(true);
    
    try {
      let context = '';
      if (selectedReport && selectedReport.aiAnalysis) {
        context = `
          Report: ${selectedReport.title}
          Summary: ${selectedReport.aiAnalysis.summary || ''}
          Findings: ${(selectedReport.aiAnalysis.findings || []).join(', ')}
          Recommendations: ${(selectedReport.aiAnalysis.recommendations || []).join(', ')}
        `;
      } else if (reports.length > 0) {
        const reportSummaries = reports.map(r => `${r.title}: ${r.aiAnalysis?.summary || 'No summary'}`).join('\n');
        context = `User has ${reports.length} medical reports. Report summaries:\n${reportSummaries}\n\nUser question: ${userQuestion}`;
      }
      
      const answer = await askAIAboutReport(userQuestion, context);
      setChatHistory(prev => [...prev, { type: 'ai', message: answer }]);
    } catch (error) {
      console.error('AI error:', error);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: "I'm having trouble analyzing that. Please try again or consult with your doctor for medical advice." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper function to safely get analysis values
  const getSafeAnalysis = (report) => {
    return {
      summary: report.aiAnalysis?.summary || 'Analysis in progress. Please check back later.',
      findings: report.aiAnalysis?.findings || ['No findings available yet'],
      recommendations: report.aiAnalysis?.recommendations || ['Consult with your doctor for personalized advice'],
      insights: report.aiAnalysis?.insights || 'Stay healthy with regular checkups'
    };
  };

  return (
    <Layout>
      <div className="ai-insights-page">
        <div className="reports-layout">
          <ReportSidebar />
          <div className="ai-insights-container">
            <div className="ai-insights-header">
              <h1>AI Health Insights</h1>
              <p>Get AI-powered analysis of your medical reports</p>
            </div>

            {reports.length === 0 ? (
              <div className="no-reports-message">
                <p>No reports uploaded yet. Go to Report Dashboard to upload your first report for AI analysis.</p>
              </div>
            ) : (
              <>
                <div className="reports-list-sidebar">
                  <h3>Your Reports</h3>
                  <div className="reports-buttons">
                    {reports.map(report => (
                      <button 
                        key={report.id}
                        className={`report-btn ${selectedReport?.id === report.id ? 'active' : ''}`}
                        onClick={() => handleReportClick(report)}
                      >
                        <span className="report-icon">📄</span>
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
                      <div className="message-text">Typing<span className="typing-dots">...</span></div>
                    </div>
                  )}
                </div>
                <div className="chat-input-area">
                  <input 
                    type="text" 
                    placeholder={selectedReport ? "Ask about this report..." : "Select a report first to ask questions..."}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={reports.length === 0}
                  />
                  <button onClick={handleSendMessage} disabled={reports.length === 0}>
                    Send
                  </button>
                </div>
              </div>
            </div>


                <div className="insights-grid">
                  {reports.map(report => {
                    const analysis = getSafeAnalysis(report);
                    return (
                      <div key={report.id} className="insight-card positive">
                        <div className="insight-header">
                          <span className="insight-icon">✅</span>
                          <h3>{report.title}</h3>
                        </div>
                        <p className="insight-text">{analysis.summary}</p>
                        <div className="insight-recommendation">
                          <strong>Recommendations:</strong>
                          <ul>
                            {analysis.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIInsights;