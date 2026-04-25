import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, address, gender, dob } = req.body;
    
    user.name = name !== undefined ? (name || '') : user.name;
    user.phone = phone !== undefined ? (phone || '') : user.phone;
    user.address = address !== undefined ? (address || '') : user.address;
    user.gender = gender !== undefined ? (gender || 'Not Selected') : user.gender;
    user.dob = dob !== undefined ? (dob || '') : user.dob;
    
    await user.save();
    
    res.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.image && user.image !== '' && !user.image.startsWith('data:image')) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(user.image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    user.image = imageUrl;
    await user.save();
    
    res.json({ 
      success: true, 
      data: { imageUrl },
      message: 'Profile image updated successfully' 
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.image && user.image !== '' && !user.image.startsWith('data:image')) {
      const oldImagePath = path.join(__dirname, '../uploads', path.basename(user.image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    user.image = '';
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Profile image removed successfully' 
    });
  } catch (error) {
    console.error('Error removing profile image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.image && user.image !== '' && !user.image.startsWith('data:image')) {
      const imagePath = path.join(__dirname, '../uploads', path.basename(user.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};