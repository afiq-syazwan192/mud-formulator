import express, { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product';
import auth from '../middleware/auth';
import { AuthRequest } from '../types/auth';

const router: Router = express.Router();

// Get all products
router.get('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new product
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('specificGravity').isNumeric().withMessage('Specific gravity must be a number'),
    body('function').notEmpty().withMessage('Function is required'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, specificGravity, function: productFunction } = req.body;

      const product = new Product({
        name,
        specificGravity,
        function: productFunction,
        createdBy: req.user?._id,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error('Add product error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete a product
router.delete('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.createdBy.toString() !== req.user?._id.toString()) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 