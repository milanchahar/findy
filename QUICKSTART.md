# 🚀 Findyy - Quick Start Guide

## Start Everything (Easiest Way)

```bash
./start-all.sh
```

This starts both backend and frontend automatically!

## Or Start Separately

### Backend (Terminal 1)
```bash
./start-backend.sh
```

### Frontend (Terminal 2)
```bash
./start-frontend.sh
```

## Access the App

- **Frontend:** http://localhost:5176
- **Backend API:** http://localhost:5001
- **Health Check:** http://localhost:5001/api/health

## First Time Setup

If you haven't installed dependencies yet:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install --legacy-peer-deps
```

## Troubleshooting

**Port in use?**
```bash
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:5176 | xargs kill -9  # Frontend
```

**Need MongoDB?**
- App works with **mock data** by default
- MongoDB only needed for user registration and creating listings
- See `SETUP.md` for MongoDB setup

## That's It! 🎉

Open http://localhost:5176 in your browser and start using Findyy!
