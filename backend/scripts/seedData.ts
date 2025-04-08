import mongoose from 'mongoose';
import { Formulation } from '../models/Formulation';
import { Product } from '../models/Product';
import { User } from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dummyProducts = [
  {
    name: 'Barite',
    specificGravity: 4.2,
    function: 'Weighting Agent',
  },
  {
    name: 'Bentonite',
    specificGravity: 2.6,
    function: 'Viscosifier',
  },
  {
    name: 'Diesel Oil',
    specificGravity: 0.85,
    function: 'Base Oil',
  },
  {
    name: 'Emulsifier',
    specificGravity: 1.1,
    function: 'Emulsifier',
  },
];

const dummyFormulations = [
  {
    mudType: 'Oil Based Mud',
    mudWeight: 12.5,
    desiredOilPercentage: 65,
    products: [
      { product: '', quantity: 100 },
      { product: '', quantity: 25 },
      { product: '', quantity: 200 },
      { product: '', quantity: 5 },
    ],
  },
  {
    mudType: 'Water Based Mud',
    mudWeight: 10.5,
    desiredOilPercentage: 0,
    products: [
      { product: '', quantity: 50 },
      { product: '', quantity: 15 },
    ],
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mud-formulator');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Formulation.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });
    console.log('Created test user');

    // Insert products
    const insertedProducts = await Product.insertMany(dummyProducts);
    console.log('Inserted products');

    // Update formulations with product IDs and user
    const formulationsWithProductIds = dummyFormulations.map((formulation) => ({
      ...formulation,
      createdBy: testUser._id,
      products: formulation.products.map((product, productIndex) => ({
        ...product,
        product: insertedProducts[productIndex % insertedProducts.length]._id,
      })),
    }));

    // Insert formulations
    await Formulation.insertMany(formulationsWithProductIds);
    console.log('Inserted formulations');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 