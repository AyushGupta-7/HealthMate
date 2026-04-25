import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from '../models/Appointment.js';

dotenv.config();

const checkAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const count = await Appointment.countDocuments();
    console.log(`Total appointments in database: ${count}`);
    
    if (count > 0) {
      const appointments = await Appointment.find().populate('user', 'name email');
      console.log('\nAppointments:');
      appointments.forEach(apt => {
        console.log(`- ${apt.doctorName} on ${apt.date} at ${apt.time} (Status: ${apt.status})`);
      });
    } else {
      console.log('\n⚠️ No appointments found!');
      console.log('Book an appointment from the frontend to see it here.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAppointments();