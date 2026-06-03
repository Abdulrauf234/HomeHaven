import { Router, Response } from 'express';
import { DB } from '../models/dbAdapter';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all enquiries (Admin only)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const list = await DB.enquiries.find();
    res.json(list);
  } catch (error) {
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

    const newEnquiry = await DB.enquiries.create({
      type, // 'general' | 'inspection' | 'whatsapp'
      name,
      email,
      phone,
      message,
      targetId,
      targetTitle
    });

    res.status(201).json(newEnquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting enquiry' });
  }
});

export default router;
