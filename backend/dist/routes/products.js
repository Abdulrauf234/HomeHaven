"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbAdapter_1 = require("../models/dbAdapter");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all products
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category)
            filter.category = String(category);
        if (search)
            filter.search = String(search);
        const products = await dbAdapter_1.DB.products.find(filter);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving products' });
    }
});
// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await dbAdapter_1.DB.products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving product' });
    }
});
// POST create product (Admin only)
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { image, name, price, description, category, availability, stock } = req.body;
        if (!image || !name || !price || !description || !category) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        const newProduct = await dbAdapter_1.DB.products.create({
            image,
            name,
            price: Number(price),
            description,
            category,
            availability: availability || 'In Stock',
            stock: Number(stock || 0)
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});
// PUT update product (Admin only)
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;
        // Type conversion check
        if (updates.price !== undefined)
            updates.price = Number(updates.price);
        if (updates.stock !== undefined)
            updates.stock = Number(updates.stock);
        const updated = await dbAdapter_1.DB.products.findByIdAndUpdate(productId, updates);
        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});
// DELETE product (Admin only)
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const success = await dbAdapter_1.DB.products.findByIdAndDelete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});
exports.default = router;
