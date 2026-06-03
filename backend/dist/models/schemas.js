"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.EnquirySchema = exports.ProductSchema = exports.PropertySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Property Schema
exports.PropertySchema = new mongoose_1.default.Schema({
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
exports.ProductSchema = new mongoose_1.default.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    availability: { type: String, enum: ['In Stock', 'Out of Stock'], default: 'In Stock' },
    stock: { type: Number, required: true, default: 0 }
}, { timestamps: true });
// Enquiry Schema
exports.EnquirySchema = new mongoose_1.default.Schema({
    type: { type: String, enum: ['general', 'inspection', 'whatsapp'], required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    message: { type: String },
    targetId: { type: String },
    targetTitle: { type: String }
}, { timestamps: true });
// Admin User Schema
exports.UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });
