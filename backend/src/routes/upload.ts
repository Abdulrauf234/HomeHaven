import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/', authMiddleware, upload.single('image'), async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    console.error("Error in upload endpoint:", error);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
});

export default router;
