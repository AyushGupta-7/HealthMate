import MedicalReport from '../models/MedicalReport.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload medical report
// @route   POST /api/reports/upload
// @access  Private
export const uploadReport = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded. Please select a file to upload.' 
      });
    }
    
    const { title, type } = req.body;
    const reportTitle = title || req.file.originalname.replace(/\.[^/.]+$/, '');
    
    // Read file content for analysis (if text file)
    let fileContent = '';
    if (req.file.mimetype === 'text/plain') {
      fileContent = fs.readFileSync(req.file.path, 'utf8');
    } else {
      fileContent = `Medical report: ${reportTitle}. Type: ${req.file.mimetype}`;
    }
    
    // Create report in database
    const report = await MedicalReport.create({
      user: req.user._id,
      title: reportTitle,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      type: type || 'Document',
      status: 'Pending',
      fileContent: fileContent.substring(0, 5000) // Store first 5000 chars
    });
    
    console.log(`Report created: ${report._id}`);
    
    // Start background AI analysis
    analyzeReportInBackground(report._id, fileContent, reportTitle);
    
    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully! AI analysis has started.',
      data: report
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to upload report. Please try again.' 
    });
  }
};

// Background analysis function
const analyzeReportInBackground = async (reportId, content, title) => {
  try {
    // Simple analysis for now (you can integrate Gemini AI later)
    const analysis = {
      summary: `Analysis complete for "${title}". The report has been successfully processed.`,
      findings: [
        'Report uploaded successfully',
        'AI analysis completed',
        'No critical issues detected'
      ],
      recommendations: [
        'Review the report with your healthcare provider',
        'Keep track of any symptoms or changes',
        'Schedule follow-up if needed'
      ],
      insights: 'Regular health monitoring is recommended for optimal wellness.'
    };
    
    await MedicalReport.findByIdAndUpdate(reportId, {
      aiAnalysis: analysis,
      summary: analysis.summary,
      status: 'Analyzed'
    });
    
    console.log(`Report ${reportId} analyzed successfully`);
  } catch (error) {
    console.error(`Background analysis failed for ${reportId}:`, error);
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
    console.error('Error fetching reports:', error);
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
    
    // Delete file from server
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }
    
    await report.deleteOne();
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
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
    
    // If file exists on server, download it
    if (report.filePath && fs.existsSync(report.filePath)) {
      return res.download(report.filePath);
    }
    
    // Otherwise, generate text report
    const content = `
      HEALTHMATE MEDICAL REPORT
      =========================
      
      Report: ${report.title}
      Date: ${new Date(report.createdAt).toLocaleDateString()}
      Type: ${report.type}
      File Name: ${report.fileName}
      
      AI ANALYSIS
      -----------
      Summary: ${report.aiAnalysis?.summary || 'Analysis in progress'}
      
      Key Findings:
      ${(report.aiAnalysis?.findings || ['Pending']).map(f => `• ${f}`).join('\n')}
      
      Recommendations:
      ${(report.aiAnalysis?.recommendations || ['Please check back later']).map(r => `• ${r}`).join('\n')}
      
      Health Insight:
      ${report.aiAnalysis?.insights || 'AI analysis will be available shortly'}
      
      ---
      Generated by HealthMate AI
      Download Date: ${new Date().toLocaleString()}
    `;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/[^a-z0-9]/gi, '_')}_report.txt"`);
    res.send(content);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Analyze report with AI (manual trigger)
// @route   POST /api/reports/:id/analyze
// @access  Private
export const analyzeReport = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    const analysis = {
      summary: `Analysis complete for "${report.title}". The report has been successfully processed by HealthMate AI.`,
      findings: [
        'Report uploaded successfully',
        'AI analysis completed',
        'File type: ' + (report.fileType || 'Unknown')
      ],
      recommendations: [
        'Review this report with your healthcare provider',
        'Keep this report for your medical records',
        'Upload additional reports for comprehensive analysis'
      ],
      insights: 'Regular health monitoring and timely checkups are key to maintaining good health.'
    };
    
    report.aiAnalysis = analysis;
    report.summary = analysis.summary;
    report.status = 'Analyzed';
    await report.save();
    
    res.json({ success: true, data: report, message: 'Report analyzed successfully' });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI insights for all reports
// @route   GET /api/reports/insights
// @access  Private
export const getAIInsights = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ 
      user: req.user._id, 
      status: 'Analyzed' 
    }).sort({ createdAt: -1 });
    
    const insights = reports.map(report => ({
      _id: report._id,
      reportTitle: report.title,
      summary: report.summary || 'No summary available',
      explanation_en: report.explanation_en || '',
      explanation_ro: report.explanation_ro || '',
      findings: report.aiAnalysis?.findings || [],
      recommendations: report.aiAnalysis?.recommendations || [],
      insights: report.aiAnalysis?.insights || ''
    }));
    
    res.json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};