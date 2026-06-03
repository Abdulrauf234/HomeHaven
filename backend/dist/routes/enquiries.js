"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbAdapter_1 = require("../models/dbAdapter");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all enquiries (Admin only)
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const list = await dbAdapter_1.DB.enquiries.find();
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving enquiries' });
    }
});
// POST create enquiry (Public)
router.post('/', async (req, res) => {
    try {
        const { type, name, email, phone, message, targetId, targetTitle } = req.body;
        if (!type || !name || !phone) {
            return res.status(400).json({ message: 'Type, name and phone number are required' });
        }
        const newEnquiry = await dbAdapter_1.DB.enquiries.create({
            type, // 'general' | 'inspection' | 'whatsapp'
            name,
            email,
            phone,
            message,
            targetId,
            targetTitle
        });
        res.status(201).json(newEnquiry);
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting enquiry' });
    }
});
exports.default = router;
