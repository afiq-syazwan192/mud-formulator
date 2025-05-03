import mongoose, { Document } from 'mongoose';

export interface IAvailableProduct extends Document {
  name: string;
  specificGravity: number;
  function: string;
}

const availableProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specificGravity: { type: Number, required: true },
  function: { type: String, required: true },
}, {
  timestamps: true
});

const AvailableProduct = mongoose.model<IAvailableProduct>('AvailableProduct', availableProductSchema);
export default AvailableProduct; 