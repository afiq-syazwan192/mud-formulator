import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import formulationRoutes from './routes/formulations';
import connectDB from './config/db';

dotenv.config();

// Connect to MongoDB first
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected successfully');
});

const app = express();

// Detailed CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('=================================');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('=================================');
  next();
});

// Test root route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Mount routes - auth routes should be mounted at /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/formulations', formulationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Handle 404
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`Server is running on port ${PORT}`);
      console.log('Available routes:');
      console.log(`- GET    http://localhost:${PORT}/`);
      console.log(`- POST   http://localhost:${PORT}/api/auth/signup`);
      console.log(`- POST   http://localhost:${PORT}/api/auth/login`);
      console.log(`- GET    http://localhost:${PORT}/api/auth/me`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 