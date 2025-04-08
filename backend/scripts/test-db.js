const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    
    // Try to find users
    const User = require('../models/User');
    const users = await User.find({});
    console.log('\nFound users:', users.length);
    
    // Check each user's details
    for (const user of users) {
      console.log('\nUser details:');
      console.log('- Email:', user.email);
      console.log('- Name:', user.name);
      console.log('- ID:', user._id);
      console.log('- Password hash length:', user.password.length);
      
      // Test password comparison
      const testPassword = 'password123';
      const isMatch = await user.comparePassword(testPassword);
      console.log('- Test password match:', isMatch);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection(); 