import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, DB } from './models/dbAdapter';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import productRoutes from './routes/products';
import enquiryRoutes from './routes/enquiries';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: DB.isUsingMongo() ? 'mongodb' : 'mock' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/upload', uploadRoutes);

// Main Server Runner
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[HomeHaven Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
