const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function resetTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    
    // Delete existing test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Deleted existing test user');

    // Create new test user with known password
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });
    
    await user.save();
    console.log('\nCreated new test user:');
    console.log('Email:', user.email);
    console.log('Password: password123');
    console.log('Name:', user.name);
    
    // Verify the password works
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      const isMatch = await testUser.comparePassword('password123');
      console.log('\nPassword verification test:', isMatch ? 'PASSED' : 'FAILED');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetTestUser(); 