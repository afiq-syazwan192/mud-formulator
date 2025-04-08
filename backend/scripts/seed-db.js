const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Formulation = require('../models/Formulation');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Formulation.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });
    console.log('Created test user:', user.email);

    // Create test products
    const products = await Product.create([
      {
        name: 'Bentonite',
        specificGravity: 2.6,
        function: 'Viscosifier',
        createdBy: user._id
      },
      {
        name: 'Barite',
        specificGravity: 4.2,
        function: 'Weighting agent',
        createdBy: user._id
      },
      {
        name: 'Diesel Oil',
        specificGravity: 0.85,
        function: 'Base fluid',
        createdBy: user._id
      }
    ]);
    console.log('Created test products:', products.length);

    // Create test formulation
    const formulation = await Formulation.create({
      mudType: 'Oil-based mud',
      mudWeight: 12.5,
      desiredOilPercentage: 70,
      products: [
        { product: products[0]._id, quantity: 50 },
        { product: products[1]._id, quantity: 100 },
        { product: products[2]._id, quantity: 200 }
      ],
      createdBy: user._id
    });
    console.log('Created test formulation');

    console.log('\nDatabase seeded successfully!');
    console.log('You can now log in with:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase(); 