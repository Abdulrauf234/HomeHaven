import mongoose from 'mongoose';

// Property Schema
export const PropertySchema = new mongoose.Schema({
  images: [{ type: String, required: true }],
  title: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  description: { type: String, required: true },
  availability: { type: String, enum: ['Available', 'Sold'], default: 'Available' }
}, { timestamps: true });

// Product Schema
export const ProductSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  availability: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
  stock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Enquiry Schema
export const EnquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['general', 'inspection', 'whatsapp'], required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  message: { type: String },
  targetId: { type: String },
  targetTitle: { type: String }
}, { timestamps: true });

// Admin User Schema
export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });
