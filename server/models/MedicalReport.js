import mongoose from 'mongoose';

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
  fileUrl: {
    type: String
  },
  filePath: {
    type: String
  },
  fileType: {
    type: String
  },
  fileContent: {
    type: String
  },
  type: {
    type: String,
    default: 'Document'
  },
  status: {
    type: String,
    enum: ['Pending', 'Analyzed'],
    default: 'Pending'
  },
  summary: {
    type: String,
    default: ''
  },
  explanation_en: {
    type: String,
    default: ''
  },
  explanation_ro: {
    type: String,
    default: ''
  },
  aiAnalysis: {
    summary: { type: String },
    findings: [{ type: String }],
    recommendations: [{ type: String }],
    insights: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
export default MedicalReport;