# Findyy - Setup Guide

## 🚀 Quick Start

### Option 1: Start Both Servers (Recommended)
```bash
./start-all.sh
```
This will start both backend and frontend servers automatically.

### Option 2: Start Servers Separately

**Backend:**
```bash
./start-backend.sh
# OR
cd backend && npm start
```

**Frontend:**
```bash
./start-frontend.sh
# OR
cd frontend && npm run dev
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (optional - app works with mock data if MongoDB is not running)

## 🔧 Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is needed due to React 19 compatibility with some packages.

## 🌐 Server Ports

- **Backend API:** http://localhost:5001
- **Frontend App:** http://localhost:5176
- **Health Check:** http://localhost:5001/api/health

## 🗄️ Database Setup (Optional)

The app works with **mock data** by default. To use MongoDB:

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will automatically connect to `mongodb://localhost:27017/findyy`

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/findyy
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🔑 Environment Variables (Optional)

Create `backend/.env` for production settings:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/findyy

# JWT
JWT_SECRET=findyy-secret-key-change-in-production

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5176

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
```

## 🐛 Troubleshooting

### Port Already in Use
If you see `EADDRINUSE` error:
```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 5176 (frontend)
lsof -ti:5176 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### MongoDB Connection Issues
- The app works with **mock data** if MongoDB is not connected
- To use real database features (user registration, listing creation), MongoDB must be running
- Check MongoDB status: `mongosh` or check if service is running

### Frontend Not Loading
1. Check if backend is running: `curl http://localhost:5001/api/health`
2. Check browser console for errors
3. Verify API URL in `frontend/src/services/api.js`

## 📁 Project Structure

```
findy/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── middleware/      # Auth middleware
│   ├── services/        # Email, etc.
│   ├── socket/          # Socket.io handlers
│   ├── data/            # Mock data
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React contexts
│   │   └── hooks/       # Custom hooks
│   └── package.json
├── start-backend.sh     # Backend startup script
├── start-frontend.sh    # Frontend startup script
└── start-all.sh         # Start both servers
```

## ✅ Verification

After starting servers, verify:

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"OK","message":"Findyy API is running"}`

2. **Frontend:**
   Open http://localhost:5176 in browser

3. **API Endpoints:**
   - Listings: http://localhost:5001/api/listings
   - Search: http://localhost:5001/api/search?q=modern

## 🎯 Features

- ✅ User Authentication (Register/Login)
- ✅ Listings CRUD (Create, Read, Update, Delete)
- ✅ Smart Search & Filters
- ✅ Favorites/Wishlist
- ✅ Reviews & Ratings
- ✅ Real-time Messaging (WebSocket)
- ✅ Image Uploads (Cloudinary)
- ✅ Payment Integration (Stripe)
- ✅ Email Notifications

## 📝 Notes

- The app uses **mock data** by default if MongoDB is not connected
- User registration and listing creation require MongoDB connection
- All other features work with mock data for development

## 🆘 Need Help?

Check the logs:
- Backend: Check terminal output or `/tmp/findyy-backend.log`
- Frontend: Check terminal output or `/tmp/findyy-frontend.log`
