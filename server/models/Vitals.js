import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodPressure: { type: String, default: '' },
  bloodSugar: { type: String, default: '' },
  weight: { type: String, default: '' },
  note: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const currentVitalsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodPressure: { type: String, default: '120/80' },
  bloodSugar: { type: String, default: '95' },
  weight: { type: String, default: '72' },
  note: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export const VitalsHistory = mongoose.model('VitalsHistory', vitalsSchema);
export const CurrentVitals = mongoose.model('CurrentVitals', currentVitalsSchema);