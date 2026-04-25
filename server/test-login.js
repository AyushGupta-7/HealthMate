import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@healthmate.com' }).select('+password');
    
    if (admin) {
      console.log('Admin user found:', admin.email);
      console.log('Admin role:', admin.role);
      
      // Test password
      const isMatch = await admin.matchPassword('Admin@123');
      console.log('Password match:', isMatch);
    } else {
      console.log('Admin user not found. Please run scripts/createAdmin.js first');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();