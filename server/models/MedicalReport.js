import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Image', 'Document'], required: true },
  fileUrl: { type: String },
  status: { type: String, enum: ['Analyzed', 'Pending'], default: 'Analyzed' },
  aiAnalysis: {
    summary: { type: String, default: '' },
    findings: [{ type: String }],
    recommendations: [{ type: String }],
    insights: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MedicalReport', medicalReportSchema);