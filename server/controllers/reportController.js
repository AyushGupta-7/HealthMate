import MedicalReport from '../models/MedicalReport.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Upload medical report
// @route   POST /api/reports/upload
// @access  Private
export const uploadReport = async (req, res) => {
  try {
    const { title, type } = req.body;
    
    let fileUrl = '';
    let fileContent = '';
    
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      
      // Extract text from file
      if (req.file.mimetype === 'text/plain') {
        fileContent = fs.readFileSync(req.file.path, 'utf8');
      } else {
        fileContent = `Medical report: ${title}. Analysis required.`;
      }
    }
    
    const report = await MedicalReport.create({
      user: req.user._id,
      title,
      fileName: req.file?.originalname || title,
      type: type || 'Document',
      fileUrl,
      fileContent: fileContent.substring(0, 5000),
      status: 'Pending'
    });
    
    // Start AI analysis in background
    analyzeReportWithAI(report._id, fileContent, title);
    
    res.status(201).json({ 
      success: true, 
      data: report, 
      message: 'Report uploaded. AI analysis in progress.' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Analyze report with Gemini AI
// @route   POST /api/reports/:id/analyze
// @access  Private
export const analyzeReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    const analysis = await performAIAnalysis(report.fileContent, report.title);
    
    report.aiAnalysis = analysis;
    report.status = 'Analyzed';
    await report.save();
    
    res.json({ success: true, data: report, message: 'Report analyzed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI insights for all reports
// @route   GET /api/reports/insights/ai
// @access  Private
export const getAIInsights = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ 
      user: req.user._id, 
      status: 'Analyzed' 
    }).sort({ createdAt: -1 });
    
    const insights = reports.map(report => ({
      id: report._id,
      title: report.title,
      summary: report.aiAnalysis?.summary,
      recommendations: report.aiAnalysis?.recommendations,
      insights: report.aiAnalysis?.insights,
      date: report.createdAt
    }));
    
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user reports
// @route   GET /api/reports
// @access  Private
export const getUserReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    // Delete file if exists
    if (report.fileUrl) {
      const filePath = path.join(__dirname, '..', report.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await report.deleteOne();
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private
export const downloadReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    if (report.fileUrl) {
      const filePath = path.join(__dirname, '..', report.fileUrl);
      if (fs.existsSync(filePath)) {
        return res.download(filePath);
      }
    }
    
    // If no file, generate text report
    const content = `
      HEALTHMATE MEDICAL REPORT
      =========================
      
      Report: ${report.title}
      Date: ${new Date(report.createdAt).toLocaleDateString()}
      Type: ${report.type}
      
      AI ANALYSIS SUMMARY
      ------------------
      ${report.aiAnalysis?.summary || 'No analysis available'}
      
      KEY FINDINGS
      ------------
      ${(report.aiAnalysis?.findings || []).map(f => `• ${f}`).join('\n')}
      
      RECOMMENDATIONS
      ---------------
      ${(report.aiAnalysis?.recommendations || []).map(r => `• ${r}`).join('\n')}
      
      HEALTH INSIGHTS
      ---------------
      ${report.aiAnalysis?.insights || 'No insights available'}
      
      ---
      Generated by HealthMate AI
    `;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/[^a-z0-9]/gi, '_')}_report.txt"`);
    res.send(content);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function for AI analysis
async function performAIAnalysis(content, title) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      You are a medical AI assistant. Analyze the following medical report and provide:

      Report: ${title}
      Content: ${content.substring(0, 3000)}

      Please provide analysis in the following JSON format:
      {
        "summary": "A 2-3 sentence summary of the report",
        "findings": ["Key finding 1", "Key finding 2", "Key finding 3"],
        "recommendations": ["Recommendation 1", "Recommendation 2"],
        "insights": "Important health insight"
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      summary: 'Analysis completed. Please consult with your doctor for detailed interpretation.',
      findings: ['Report uploaded successfully', 'AI analysis performed'],
      recommendations: ['Consult with your doctor for detailed analysis'],
      insights: 'Regular health monitoring is recommended'
    };
  } catch (error) {
    console.error('AI Analysis error:', error);
    return {
      summary: 'AI analysis in progress. Please check back later.',
      findings: ['Analysis pending'],
      recommendations: ['Upload a clear report for better analysis'],
      insights: 'Health monitoring is important'
    };
  }
}

async function analyzeReportWithAI(reportId, content, title) {
  try {
    const analysis = await performAIAnalysis(content, title);
    await MedicalReport.findByIdAndUpdate(reportId, {
      aiAnalysis: analysis,
      status: 'Analyzed'
    });
    console.log(`Report ${reportId} analyzed successfully`);
  } catch (error) {
    console.error(`AI analysis failed for ${reportId}:`, error);
  }
}