import { Router, Response } from 'express';
import { DB } from '../models/dbAdapter';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all properties
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    const filter: any = {};
    if (type) filter.type = String(type);
    if (search) filter.search = String(search);

    const properties = await DB.properties.find(filter);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving properties' });
  }
});

// GET single property
router.get('/:id', async (req, res) => {
  try {
    const property = await DB.properties.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving property' });
  }
});

// POST create property (Admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { images, title, type, location, price, bedrooms, bathrooms, description, availability } = req.body;
    
    if (!images || !title || !type || !location || !price || !description) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const newProperty = await DB.properties.create({
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
  } catch (error) {
    res.status(500).json({ message: 'Error creating property' });
  }
});

// PUT update property (Admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = req.params.id;
    const updates = req.body;
    
    // Type conversion check
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.bedrooms !== undefined) updates.bedrooms = Number(updates.bedrooms);
    if (updates.bathrooms !== undefined) updates.bathrooms = Number(updates.bathrooms);
    if (updates.images && !Array.isArray(updates.images)) updates.images = [updates.images];

    const updated = await DB.properties.findByIdAndUpdate(propertyId, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property' });
  }
});

// DELETE property (Admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const success = await DB.properties.findByIdAndDelete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property' });
  }
});

export default router;
