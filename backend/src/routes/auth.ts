import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'haven_secret_key_123';

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'homehaven' && password === 'Haven@123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      token,
      admin: { username }
    });
  }

  return res.status(401).json({ message: 'Invalid credentials. Use homehaven / Haven@123' });
});

export default router;
