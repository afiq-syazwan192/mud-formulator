import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Formulation, IFormulation } from '../models/Formulation';
import { auth } from '../middleware/auth';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

const router: Router = express.Router();

// Get all formulations for current user
router.get('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
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

// Add a new formulation
router.post(
  '/',
  auth,
  [
    body('mudType').notEmpty().withMessage('Mud type is required'),
    body('mudWeight').isNumeric().withMessage('Mud weight must be a number'),
    body('desiredOilPercentage').isNumeric().withMessage('Desired oil percentage must be a number'),
    body('products').isArray().withMessage('Products must be an array'),
    body('products.*.product').notEmpty().withMessage('Product ID is required'),
    body('products.*.quantity').isNumeric().withMessage('Product quantity must be a number'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { mudType, mudWeight, desiredOilPercentage, products } = req.body;

      const formulation = new Formulation({
        mudType,
        mudWeight,
        desiredOilPercentage,
        products,
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
  }
);

// Delete a formulation
router.delete('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const formulation = await Formulation.findById(req.params.id).populate('createdBy') as IFormulation & { createdBy: { _id: string } };
    
    if (!formulation) {
      res.status(404).json({ error: 'Formulation not found' });
      return;
    }

    if (formulation.createdBy._id.toString() !== req.user?._id?.toString()) {
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