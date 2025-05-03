import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import Formulation from '../models/Formulation';
import Product from '../models/Product';
import auth from '../middleware/auth';
import { AuthRequest } from '../types/auth';

const router = Router();

// Get all formulations
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const formulations = await Formulation.find({ createdBy: req.user?._id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(formulations);
  } catch (error) {
    console.error('Get formulations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new formulation
router.post('/', auth, [
  body('mudType').notEmpty().withMessage('Mud type is required'),
  body('mudWeight').isNumeric().withMessage('Mud weight must be a number'),
  body('desiredOilPercentage').isNumeric().withMessage('Desired oil percentage must be a number'),
  body('products').isArray().withMessage('Products must be an array'),
  body('products.*.product').notEmpty().withMessage('Product name is required'),
  body('products.*.quantity').isNumeric().withMessage('Product quantity must be a number'),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { mudType, mudWeight, desiredOilPercentage, products } = req.body;

    // First, create or find products
    const productPromises = products.map(async (productData: { product: string; quantity: number }) => {
      const product = new Product({
        name: productData.product,
        specificGravity: 1.0, // Default value, can be updated later
        function: 'Other', // Default value, can be updated later
        createdBy: req.user?._id,
      });
      await product.save();
      return {
        product: product._id,
        quantity: productData.quantity
      };
    });

    const savedProducts = await Promise.all(productPromises);

    // Create the formulation with the saved products
    const formulation = new Formulation({
      mudType,
      mudWeight,
      desiredOilPercentage,
      products: savedProducts,
      createdBy: req.user?._id,
    });

    await formulation.save();
    
    const populatedFormulation = await Formulation.findById(formulation._id)
      .populate('products.product');
    
    res.status(201).json(populatedFormulation);
  } catch (error) {
    console.error('Add formulation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete formulation
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const formulation = await Formulation.findById(req.params.id).populate('createdBy');
    
    if (!formulation) {
      res.status(404).json({ error: 'Formulation not found' });
      return;
    }

    const populatedFormulation = formulation.toObject();
    const createdBy = populatedFormulation.createdBy as unknown as { _id: string };
    
    if (createdBy._id.toString() !== req.user?._id?.toString()) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await formulation.deleteOne();
    res.json({ message: 'Formulation removed' });
  } catch (error) {
    console.error('Delete formulation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 