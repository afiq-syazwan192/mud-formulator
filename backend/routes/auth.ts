import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import auth from '../middleware/auth';
import { AuthRequest } from '../types/auth';
import { JWT_CONFIG } from '../config/jwt';

const router = Router();

interface JwtPayload {
  userId: string;
  email: string;
  name: string;
}

// Debug route to test auth router
router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Auth router is working' });
});

// Register/Signup user
router.post('/signup', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
], async (req: Request, res: Response, next: NextFunction) => {
  console.log('Signup request received:', { ...req.body, password: '[HIDDEN]' });
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, name } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    user = new User({ email, password, name });
    await user.save();
    console.log('New user created:', email);

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    };

    const signOptions: SignOptions = {
      expiresIn: JWT_CONFIG.expiresIn
    };

    const token = jwt.sign(payload, JWT_CONFIG.secret, signOptions);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    next(error);
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').exists().withMessage('Password is required'),
], async (req: Request, res: Response, next: NextFunction) => {
  console.log('Login request received:', { email: req.body.email });
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    };

    const signOptions: SignOptions = {
      expiresIn: JWT_CONFIG.expiresIn
    };

    const token = jwt.sign(payload, JWT_CONFIG.secret, signOptions);

    console.log('Login successful:', email);
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});


// Get current user
router.get('/me', auth, (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }
    
    User.findById(req.user._id)
      .select('-password')
      .then(user => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        res.json(user);
      })
      .catch(error => {
        console.error('Get user error:', error);
        next(error);
      });
  } catch (error) {
    console.error('Get user error:', error);
    next(error);
  }
});


export default router; 