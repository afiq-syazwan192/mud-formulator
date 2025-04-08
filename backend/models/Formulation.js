const mongoose = require('mongoose');

const formulationSchema = new mongoose.Schema({
  mudType: {
    type: String,
    required: true,
    trim: true,
  },
  mudWeight: {
    type: Number,
    required: true,
  },
  desiredOilPercentage: {
    type: Number,
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Formulation', formulationSchema); 