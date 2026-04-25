import mongoose from 'mongoose';

// Current Vitals Schema (single document per user)
const currentVitalsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bloodPressure: {
    type: String,
    default: '120/80'
  },
  bloodSugar: {
    type: String,
    default: '95'
  },
  weight: {
    type: String,
    default: '72'
  },
  note: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Vitals History Schema (multiple entries per user)
const vitalsHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodPressure: {
    type: String,
    required: true
  },
  bloodSugar: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const CurrentVitals = mongoose.model('CurrentVitals', currentVitalsSchema);
export const VitalsHistory = mongoose.model('VitalsHistory', vitalsHistorySchema);