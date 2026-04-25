import MedicalReport from '../models/MedicalReport.js';

export const uploadReport = async (req, res) => {
  try {
    const report = await MedicalReport.create({
      user: req.user._id,
      title: req.body.title,
      fileName: req.file?.originalname || req.body.title,
      type: req.body.type,
      fileUrl: req.file?.path || '',
      status: 'Analyzed'
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await MedicalReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};