import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import campusRouter from './routes/campus.js';
import { initDatabase } from './db/database.js';

dotenv.config();

// Initialize SQLite database schema and seed records
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev & preview origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Healthcheck & root endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GreenCore AI Backend Engine',
    version: '1.2.0',
    hackathon: 'HACKVERSE ’26 (CB-SW-05)',
    institution: 'ECO CLUB, Govt. College of Engineering Kalahandi'
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to GREENCORE AI — Campus Sustainability Digital Twin & Action Engine REST API',
    documentation: '/api/campus/overview',
    health: '/health'
  });
});

// Mount Routes
app.use('/api/campus', campusRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🌱 GREENCORE Backend Server active on port ${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/health`);
  console.log(`📊 Campus API:  http://localhost:${PORT}/api/campus/overview`);
});
