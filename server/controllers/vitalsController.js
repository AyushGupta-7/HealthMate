import { CurrentVitals, VitalsHistory } from '../models/Vitals.js';

export const getCurrentVitals = async (req, res) => {
  try {
    let vitals = await CurrentVitals.findOne({ user: req.user._id });
    
    if (!vitals) {
      vitals = await CurrentVitals.create({
        user: req.user._id,
        bloodPressure: '120/80',
        bloodSugar: '95',
        weight: '72',
        note: ''
      });
    }
    
    res.json({ success: true, data: vitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCurrentVitals = async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, weight, note } = req.body;
    
    const vitals = await CurrentVitals.findOneAndUpdate(
      { user: req.user._id },
      {
        bloodPressure: bloodPressure || '120/80',
        bloodSugar: bloodSugar || '95',
        weight: weight || '72',
        note: note || '',
        updatedAt: Date.now()
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      data: vitals,
      message: 'Current vitals updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addVitalsHistory = async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, weight, note, date, time } = req.body;
    
    if (!bloodPressure || !bloodSugar || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Blood Pressure, Blood Sugar, and Weight are required'
      });
    }
    
    const historyEntry = await VitalsHistory.create({
      user: req.user._id,
      bloodPressure,
      bloodSugar,
      weight,
      note: note || '',
      date: date || new Date().toLocaleDateString('en-US'),
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
    
    res.status(201).json({
      success: true,
      data: historyEntry,
      message: 'Vitals added to history successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVitalsHistory = async (req, res) => {
  try {
    const history = await VitalsHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this missing function
export const getVitalsHistoryById = async (req, res) => {
  try {
    const entry = await VitalsHistory.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Vitals entry not found' });
    }
    
    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this missing function
export const updateVitalsHistoryEntry = async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, weight, note } = req.body;
    
    const entry = await VitalsHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { bloodPressure, bloodSugar, weight, note },
      { new: true }
    );
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Vitals entry not found' });
    }
    
    res.json({
      success: true,
      data: entry,
      message: 'Vitals entry updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVitalsEntry = async (req, res) => {
  try {
    const entry = await VitalsHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!entry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vitals entry not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Vitals entry deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

export const getVitalsTrend = async (req, res) => {
  try {
    const history = await VitalsHistory.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .limit(30);
    
    const trend = {
      bloodPressure: [],
      bloodSugar: [],
      weight: []
    };
    
    history.forEach(entry => {
      trend.bloodPressure.push({
        date: entry.date,
        value: entry.bloodPressure
      });
      trend.bloodSugar.push({
        date: entry.date,
        value: parseFloat(entry.bloodSugar)
      });
      trend.weight.push({
        date: entry.date,
        value: parseFloat(entry.weight)
      });
    });
    
    res.json({ success: true, data: trend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVitalsStats = async (req, res) => {
  try {
    const history = await VitalsHistory.find({ user: req.user._id });
    
    if (history.length === 0) {
      return res.json({
        success: true,
        data: {
          averageBloodPressure: { systolic: 0, diastolic: 0 },
          averageBloodSugar: 0,
          averageWeight: 0,
          totalEntries: 0
        }
      });
    }
    
    let totalSystolic = 0;
    let totalDiastolic = 0;
    let totalSugar = 0;
    let totalWeight = 0;
    
    history.forEach(entry => {
      const [systolic, diastolic] = entry.bloodPressure.split('/');
      totalSystolic += parseInt(systolic) || 0;
      totalDiastolic += parseInt(diastolic) || 0;
      totalSugar += parseFloat(entry.bloodSugar) || 0;
      totalWeight += parseFloat(entry.weight) || 0;
    });
    
    const count = history.length;
    
    res.json({
      success: true,
      data: {
        averageBloodPressure: {
          systolic: Math.round(totalSystolic / count),
          diastolic: Math.round(totalDiastolic / count)
        },
        averageBloodSugar: Math.round(totalSugar / count),
        averageWeight: Math.round(totalWeight / count),
        totalEntries: count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};