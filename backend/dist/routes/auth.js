"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'haven_secret_key_123';
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'homehaven' && password === 'Haven@123') {
        const token = jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            token,
            admin: { username }
        });
    }
    return res.status(401).json({ message: 'Invalid credentials. Use homehaven / Haven@123' });
});
exports.default = router;
