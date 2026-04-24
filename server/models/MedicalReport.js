const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['PDF', 'Image', 'Document'],
    required: true
  },
  date: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  fileContent: {
    type: String
  },
  aiAnalysis: {
    summary: { type: String, default: '' },
    findings: [{ type: String }],
    recommendations: [{ type: String }],
    insights: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['Analyzed', 'Pending'],
    default: 'Analyzed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);