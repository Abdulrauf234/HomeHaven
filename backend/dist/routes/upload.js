"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
router.post('/', auth_1.authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Convert file to base64 Data URI
        const base64Data = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;
        // In a real environment, we'd upload to Cloudinary:
        // const result = await cloudinary.uploader.upload(dataUri);
        // return res.json({ url: result.secure_url });
        return res.json({ url: dataUri });
    }
    catch (error) {
        console.error("Error in upload endpoint:", error);
        return res.status(500).json({ message: 'Failed to upload image' });
    }
});
exports.default = router;
