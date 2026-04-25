import { CurrentVitals, VitalsHistory } from '../models/Vitals.js';

export const getCurrentVitals = async (req, res) => {
  try {
    let vitals = await CurrentVitals.findOne({ user: req.user._id });
    if (!vitals) {
      vitals = await CurrentVitals.create({ user: req.user._id });
    }
    res.json({ success: true, data: vitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCurrentVitals = async (req, res) => {
  try {
    const vitals = await CurrentVitals.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: vitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addVitalsHistory = async (req, res) => {
  try {
    const history = await VitalsHistory.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVitalsHistory = async (req, res) => {
  try {
    const history = await VitalsHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVitalsEntry = async (req, res) => {
  try {
    await VitalsHistory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};