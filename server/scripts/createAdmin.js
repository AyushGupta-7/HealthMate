import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@healthmate.com' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        name: 'Admin User',
        email: 'ayush1708@healthmate.com',
        password: 'Ayush@1708Health',
        role: 'admin',
        phone: '9999999999'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@healthmate.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('⚠️ Admin user already exists');
    }
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();