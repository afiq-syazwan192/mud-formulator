import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IProduct extends Document {
  name: string;
  specificGravity: number;
  function: string;
  createdBy: IUser['_id'];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  specificGravity: { type: Number, required: true },
  function: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema); 