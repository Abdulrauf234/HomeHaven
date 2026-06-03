"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbAdapter_1 = require("../models/dbAdapter");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all properties
router.get('/', async (req, res) => {
    try {
        const { type, search } = req.query;
        const filter = {};
        if (type)
            filter.type = String(type);
        if (search)
            filter.search = String(search);
        const properties = await dbAdapter_1.DB.properties.find(filter);
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving properties' });
    }
});
// GET single property
router.get('/:id', async (req, res) => {
    try {
        const property = await dbAdapter_1.DB.properties.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving property' });
    }
});
// POST create property (Admin only)
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { images, title, type, location, price, bedrooms, bathrooms, description, availability } = req.body;
        if (!images || !title || !type || !location || !price || !description) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        const newProperty = await dbAdapter_1.DB.properties.create({
            images: Array.isArray(images) ? images : [images],
            title,
            type,
            location,
            price: Number(price),
            bedrooms: Number(bedrooms || 0),
            bathrooms: Number(bathrooms || 0),
            description,
            availability: availability || 'Available'
        });
        res.status(201).json(newProperty);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating property' });
    }
});
// PUT update property (Admin only)
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const propertyId = req.params.id;
        const updates = req.body;
        // Type conversion check
        if (updates.price !== undefined)
            updates.price = Number(updates.price);
        if (updates.bedrooms !== undefined)
            updates.bedrooms = Number(updates.bedrooms);
        if (updates.bathrooms !== undefined)
            updates.bathrooms = Number(updates.bathrooms);
        if (updates.images && !Array.isArray(updates.images))
            updates.images = [updates.images];
        const updated = await dbAdapter_1.DB.properties.findByIdAndUpdate(propertyId, updates);
        if (!updated) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating property' });
    }
});
// DELETE property (Admin only)
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const success = await dbAdapter_1.DB.properties.findByIdAndDelete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ message: 'Property deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting property' });
    }
});
exports.default = router;
