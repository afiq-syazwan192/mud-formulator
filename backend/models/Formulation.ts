import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

interface IFormulationProduct {
  product: IProduct['_id'];
  quantity: number;
}

export interface IFormulation extends Document {
  mudType: string;
  mudWeight: number;
  desiredOilPercentage: number;
  products: IFormulationProduct[];
  createdBy: IUser['_id'];
}

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

// Create and export the model
const Formulation = mongoose.model<IFormulation>('Formulation', formulationSchema);
export default Formulation; 