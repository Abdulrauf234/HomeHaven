"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("./schemas");
const mockStore_1 = require("../data/mockStore");
let isMongoConnected = false;
// Mongoose Models
let PropertyModel;
let ProductModel;
let EnquiryModel;
let UserModel;
async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.log("No MONGODB_URI environment variable found. Falling back to local file-based database store.");
        return false;
    }
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(mongoUri);
        isMongoConnected = true;
        console.log("Successfully connected to MongoDB.");
        // Initialize models
        PropertyModel = mongoose_1.default.models.Property || mongoose_1.default.model('Property', schemas_1.PropertySchema);
        ProductModel = mongoose_1.default.models.Product || mongoose_1.default.model('Product', schemas_1.ProductSchema);
        EnquiryModel = mongoose_1.default.models.Enquiry || mongoose_1.default.model('Enquiry', schemas_1.EnquirySchema);
        UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', schemas_1.UserSchema);
        return true;
    }
    catch (error) {
        console.error("Error connecting to MongoDB, falling back to local database store:", error);
        isMongoConnected = false;
        return false;
    }
}
exports.DB = {
    isUsingMongo: () => isMongoConnected,
    // Properties API
    properties: {
        find: async (filter = {}) => {
            if (isMongoConnected) {
                const query = {};
                if (filter.type)
                    query.type = filter.type;
                if (filter.search) {
                    query.$or = [
                        { title: { $regex: filter.search, $options: 'i' } },
                        { description: { $regex: filter.search, $options: 'i' } },
                        { location: { $regex: filter.search, $options: 'i' } }
                    ];
                }
                const list = await PropertyModel.find(query);
                return list.map(item => ({
                    id: item._id.toString(),
                    images: item.images,
                    title: item.title,
                    type: item.type,
                    location: item.location,
                    price: item.price,
                    bedrooms: item.bedrooms,
                    bathrooms: item.bathrooms,
                    description: item.description,
                    availability: item.availability
                }));
            }
            else {
                let list = mockStore_1.MockStore.getProperties();
                if (filter.type) {
                    list = list.filter(p => p.type.toLowerCase() === filter.type.toLowerCase());
                }
                if (filter.search) {
                    const s = filter.search.toLowerCase();
                    list = list.filter(p => p.title.toLowerCase().includes(s) ||
                        p.description.toLowerCase().includes(s) ||
                        p.location.toLowerCase().includes(s));
                }
                return list;
            }
        },
        findById: async (id) => {
            if (isMongoConnected) {
                try {
                    const item = await PropertyModel.findById(id);
                    if (!item)
                        return null;
                    return {
                        id: item._id.toString(),
                        images: item.images,
                        title: item.title,
                        type: item.type,
                        location: item.location,
                        price: item.price,
                        bedrooms: item.bedrooms,
                        bathrooms: item.bathrooms,
                        description: item.description,
                        availability: item.availability
                    };
                }
                catch {
                    return null;
                }
            }
            else {
                return mockStore_1.MockStore.getPropertyById(id) || null;
            }
        },
        create: async (data) => {
            if (isMongoConnected) {
                const item = await PropertyModel.create(data);
                return { ...data, id: item._id.toString() };
            }
            else {
                return mockStore_1.MockStore.createProperty(data);
            }
        },
        findByIdAndUpdate: async (id, updates) => {
            if (isMongoConnected) {
                try {
                    const item = await PropertyModel.findByIdAndUpdate(id, updates, { new: true });
                    if (!item)
                        return null;
                    return {
                        id: item._id.toString(),
                        images: item.images,
                        title: item.title,
                        type: item.type,
                        location: item.location,
                        price: item.price,
                        bedrooms: item.bedrooms,
                        bathrooms: item.bathrooms,
                        description: item.description,
                        availability: item.availability
                    };
                }
                catch {
                    return null;
                }
            }
            else {
                return mockStore_1.MockStore.updateProperty(id, updates) || null;
            }
        },
        findByIdAndDelete: async (id) => {
            if (isMongoConnected) {
                try {
                    const res = await PropertyModel.findByIdAndDelete(id);
                    return !!res;
                }
                catch {
                    return false;
                }
            }
            else {
                return mockStore_1.MockStore.deleteProperty(id);
            }
        }
    },
    // Products API
    products: {
        find: async (filter = {}) => {
            if (isMongoConnected) {
                const query = {};
                if (filter.category)
                    query.category = filter.category;
                if (filter.search) {
                    query.$or = [
                        { name: { $regex: filter.search, $options: 'i' } },
                        { description: { $regex: filter.search, $options: 'i' } }
                    ];
                }
                const list = await ProductModel.find(query);
                return list.map(item => ({
                    id: item._id.toString(),
                    image: item.image,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    category: item.category,
                    availability: item.availability,
                    stock: item.stock
                }));
            }
            else {
                let list = mockStore_1.MockStore.getProducts();
                if (filter.category) {
                    list = list.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
                }
                if (filter.search) {
                    const s = filter.search.toLowerCase();
                    list = list.filter(p => p.name.toLowerCase().includes(s) ||
                        p.description.toLowerCase().includes(s));
                }
                return list;
            }
        },
        findById: async (id) => {
            if (isMongoConnected) {
                try {
                    const item = await ProductModel.findById(id);
                    if (!item)
                        return null;
                    return {
                        id: item._id.toString(),
                        image: item.image,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        category: item.category,
                        availability: item.availability,
                        stock: item.stock
                    };
                }
                catch {
                    return null;
                }
            }
            else {
                return mockStore_1.MockStore.getProductById(id) || null;
            }
        },
        create: async (data) => {
            if (isMongoConnected) {
                const item = await ProductModel.create(data);
                return { ...data, id: item._id.toString() };
            }
            else {
                return mockStore_1.MockStore.createProduct(data);
            }
        },
        findByIdAndUpdate: async (id, updates) => {
            if (isMongoConnected) {
                try {
                    const item = await ProductModel.findByIdAndUpdate(id, updates, { new: true });
                    if (!item)
                        return null;
                    return {
                        id: item._id.toString(),
                        image: item.image,
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        category: item.category,
                        availability: item.availability,
                        stock: item.stock
                    };
                }
                catch {
                    return null;
                }
            }
            else {
                return mockStore_1.MockStore.updateProduct(id, updates) || null;
            }
        },
        findByIdAndDelete: async (id) => {
            if (isMongoConnected) {
                try {
                    const res = await ProductModel.findByIdAndDelete(id);
                    return !!res;
                }
                catch {
                    return false;
                }
            }
            else {
                return mockStore_1.MockStore.deleteProduct(id);
            }
        }
    },
    // Enquiries API
    enquiries: {
        find: async () => {
            if (isMongoConnected) {
                const list = await EnquiryModel.find().sort({ createdAt: -1 });
                return list.map(item => ({
                    id: item._id.toString(),
                    type: item.type,
                    name: item.name,
                    email: item.email,
                    phone: item.phone,
                    message: item.message,
                    targetId: item.targetId,
                    targetTitle: item.targetTitle,
                    createdAt: item.createdAt.toISOString()
                }));
            }
            else {
                return mockStore_1.MockStore.getEnquiries();
            }
        },
        create: async (data) => {
            if (isMongoConnected) {
                const item = await EnquiryModel.create(data);
                return {
                    ...data,
                    id: item._id.toString(),
                    createdAt: item.createdAt.toISOString()
                };
            }
            else {
                return mockStore_1.MockStore.createEnquiry(data);
            }
        }
    }
};
