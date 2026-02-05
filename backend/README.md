# Findyy Backend API

Complete Node.js/Express backend for the Findyy roommate finder application.

## Features

- ✅ RESTful API for listings (CRUD operations)
- ✅ Advanced search with filters
- ✅ GeoJSON location-based queries
- ✅ Works with MongoDB or mock data (fallback)
- ✅ Error handling middleware
- ✅ CORS enabled for frontend integration

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/findyy
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/findyy
```

### 3. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Listings
- `GET /api/listings` - Get all listings (with optional filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing (soft delete)

### Search
- `GET /api/search?q=query` - Simple text search
- `GET /api/search/advanced` - Advanced search with filters

## Query Parameters

### Listings Filters
- `pureVeg` - Boolean (true/false)
- `gender` - String (Male/Female/Co-ed)
- `minPrice` - Number
- `maxPrice` - Number
- `maxDistance` - Number (km)
- `longitude` - Number (for geospatial search)
- `latitude` - Number (for geospatial search)
- `earlyBird` - Boolean (true/false)
- `nightOwl` - Boolean (true/false)
- `q` - String (text search in title/description)

### Example Requests

```bash
# Get all listings
GET /api/listings

# Filter by gender and price
GET /api/listings?gender=Co-ed&maxPrice=15000

# Search for "modern"
GET /api/search?q=modern

# Advanced search
GET /api/search/advanced?q=studio&pureVeg=true&maxPrice=15000
```

## Mock Data Mode

If MongoDB is not connected, the API automatically uses mock data from `backend/data/mockData.js`. This allows the backend to work immediately without database setup.

## Project Structure

```
backend/
├── controllers/
│   └── searchController.js    # Search logic
├── data/
│   └── mockData.js            # Mock listings data
├── models/
│   └── Listing.js             # Mongoose schema
├── routes/
│   ├── listings.js            # Listing routes
│   └── searchRoutes.js        # Search routes
├── server.js                  # Express server setup
└── package.json
```

## MongoDB Schema

The Listing model includes:
- Basic info (title, description, price)
- GeoJSON location (for distance queries)
- Filters (pureVeg, gender, lifestyle)
- Contact information
- Amenities array
- Timestamps

## Error Handling

All routes include proper error handling:
- 404 for not found
- 400 for validation errors
- 500 for server errors
- Custom error messages

## CORS

CORS is enabled to allow frontend (running on different port) to access the API.
