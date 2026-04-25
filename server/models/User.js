// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please add a name'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Please add an email'],
//     unique: true,
//     lowercase: true,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Please add a valid email'
//     ]
//   },
//   image: {
//     type: String,
//     default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
//   },
//   phone: {
//     type: String,
//     default: '0000000000'
//   },
//   address: {
//     type: Object,
//     default: { line1: '', line2: '', city: '', state: '', pincode: '' }
//   },
//   gender: {
//     type: String,
//     enum: ['Male', 'Female', 'Other', 'Not Selected'],
//     default: 'Not Selected'
//   },
//   dob: {
//     type: String,
//     default: 'Not Selected'
//   },
//   password: {
//     type: String,
//     required: [true, 'Please add a password'],
//     minlength: 6,
//     select: false
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Encrypt password using bcrypt
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Match user entered password to hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);
// export default User;


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  image: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  gender: { type: String, default: 'Not Selected' },
  dob: { type: String, default: 'Not Selected' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
  
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Alias for matchPassword (for backward compatibility)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);