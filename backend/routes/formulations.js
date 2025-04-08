const express = require('express');
const { body, validationResult } = require('express-validator');
const Formulation = require('../models/Formulation');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all formulations for current user
router.get('/', auth, async (req, res) => {
  try {
    const formulations = await Formulation.find({ createdBy: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(formulations);
  } catch (error) {
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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { mudType, mudWeight, desiredOilPercentage, products } = req.body;

      const formulation = new Formulation({
        mudType,
        mudWeight,
        desiredOilPercentage,
        products,
        createdBy: req.user._id,
      });

      await formulation.save();
      
      const populatedFormulation = await Formulation.findById(formulation._id)
        .populate('products.product');
      
      res.status(201).json(populatedFormulation);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete a formulation
router.delete('/:id', auth, async (req, res) => {
  try {
    const formulation = await Formulation.findById(req.params.id);
    
    if (!formulation) {
      return res.status(404).json({ error: 'Formulation not found' });
    }

    if (formulation.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await formulation.deleteOne();
    res.json({ message: 'Formulation removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 