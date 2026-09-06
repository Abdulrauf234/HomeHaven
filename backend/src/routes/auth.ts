import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'els_gadget_secret_key_2026';

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'elsgadget' && password === 'ElsGadget@2026') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      token,
      admin: { username }
    });
  }

  return res.status(401).json({ message: 'Invalid credentials. Use elsgadget / ElsGadget@2026' });
});

export default router;

