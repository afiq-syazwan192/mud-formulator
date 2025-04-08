import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  specificGravity: number;
  function: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  specificGravity: { type: Number, required: true },
  function: { type: String, required: true },
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema); 