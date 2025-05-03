import { Router, Request, Response } from 'express';
import AvailableProduct from '../models/AvailableProduct';

const router = Router();

// Get all available products
router.get('/', async (_req: Request, res: Response) => {
  const products = await AvailableProduct.find();
  res.json(products);
});

// Add a new available product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, specificGravity, function: func } = req.body;
    const product = new AvailableProduct({ name, specificGravity, function: func });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add available product' });
  }
});

export default router; 