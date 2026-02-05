import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import listingRoutes from './routes/listings.js';
import searchRoutes from './routes/searchRoutes.js';
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import { setupSocketIO } from './socket/socketHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to avoid conflict with AirPlay

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional, for development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/listings', listingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', imageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Findyy API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Findyy API - Roommate Finder for ADYPU, Pune',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      listings: '/api/listings',
      search: '/api/search',
      advancedSearch: '/api/search/advanced',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler for undefined routes (must be last, after all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/listings',
      'GET /api/listings/:id',
      'POST /api/listings',
      'PUT /api/listings/:id',
      'DELETE /api/listings/:id',
      'GET /api/search?q=query',
      'GET /api/search/advanced',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
    ],
  });
});

// Connect to MongoDB (optional - works with mock data if not connected)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/findyy';
    
    // Set connection timeout to prevent hanging
    const connectionOptions = {
      serverSelectionTimeoutMS: 2000, // 2 seconds timeout
    };
    
    await mongoose.connect(mongoURI, connectionOptions);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.warn('⚠️  MongoDB not connected:', error?.message || error);
    console.log('ℹ️  Running with mock data. To use MongoDB:');
    console.log('   1. Start MongoDB locally: mongodb://localhost:27017');
    console.log('   2. Or set MONGODB_URI in backend/.env to Atlas connection string');
    return false;
  }
};

// Create HTTP server for Socket.io
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5176',
    methods: ['GET', 'POST'],
  },
});

// Setup Socket.io handlers
setupSocketIO(io);

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Search: http://localhost:${PORT}/api/search?q=modern`);
    console.log(`💬 WebSocket: Ready for real-time messaging`);
    if (!dbConnected) {
      console.log('💡 Using mock data - MongoDB not connected');
    }
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;
