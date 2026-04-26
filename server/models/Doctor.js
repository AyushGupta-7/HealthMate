import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  image: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  slots_booked: { type: Object, default: {} },
  address: {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
}, { minimize: false });

// Method to check if a slot is available
doctorSchema.methods.isSlotAvailable = function(date, time) {
  const dateKey = new Date(date).toDateString();
  const bookedSlots = this.slots_booked[dateKey] || [];
  return !bookedSlots.includes(time) && this.available;
};

// Method to book a slot
doctorSchema.methods.bookSlot = async function(date, time) {
  const dateKey = new Date(date).toDateString();
  if (!this.slots_booked[dateKey]) {
    this.slots_booked[dateKey] = [];
  }
  if (!this.slots_booked[dateKey].includes(time)) {
    this.slots_booked[dateKey].push(time);
    await this.save();
    return true;
  }
  return false;
};

// Method to free a slot (when appointment is cancelled)
doctorSchema.methods.freeSlot = async function(date, time) {
  const dateKey = new Date(date).toDateString();
  if (this.slots_booked[dateKey]) {
    this.slots_booked[dateKey] = this.slots_booked[dateKey].filter(s => s !== time);
    if (this.slots_booked[dateKey].length === 0) {
      delete this.slots_booked[dateKey];
    }
    await this.save();
    return true;
  }
  return false;
};

// Method to clean up past dates
doctorSchema.methods.cleanupPastDates = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let changed = false;
  
  for (const dateKey in this.slots_booked) {
    const slotDate = new Date(dateKey);
    if (slotDate < today) {
      delete this.slots_booked[dateKey];
      changed = true;
    }
  }
  
  if (changed) {
    await this.save();
  }
  
  return changed;
};

export default mongoose.model('Doctor', doctorSchema);