const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('Testing MongoDB Atlas connection...');
  console.log('Connection string (hidden password):', 
    process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔧 CAUSE: Wrong username or password');
      console.log('1. Go to MongoDB Atlas → Database Access');
      console.log('2. Check if user "healthiq_user" exists');
      console.log('3. Try resetting password to "HealthIQ123"');
      console.log('4. Update .env file with exact credentials');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 CAUSE: Wrong cluster name');
      console.log('1. Check your cluster name in Atlas');
      console.log('2. Make sure the format is: cluster0.xxxxx.mongodb.net');
    }
  }
};

testConnection();