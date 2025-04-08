const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, specificGravity, function: productFunction } = req.body;

      const product = new Product({
        name,
        specificGravity,
        function: productFunction,
        createdBy: req.user._id,
      });

      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 