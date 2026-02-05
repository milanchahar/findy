import express from 'express';
import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import { mockListings } from '../data/mockData.js';

const router = express.Router();

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Helper to convert mock data to MongoDB format
const formatMockListing = (mock) => {
  return {
    ...mock,
    _id: mock.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Get all listings with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      pureVeg,
      gender,
      minPrice,
      maxPrice,
      maxDistance,
      longitude,
      latitude,
      earlyBird,
      nightOwl,
      q, // Search query
    } = req.query;

    let listings;

    if (isMongoConnected()) {
      // Use MongoDB
      const query = { isActive: true };

      // Text search
      if (q) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
        ];
      }

      if (pureVeg === 'true') {
        query.pureVeg = true;
      }

      if (gender && ['Male', 'Female', 'Co-ed'].includes(gender)) {
        query.gender = gender;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (earlyBird === 'true') {
        query['lifestyle.earlyBird'] = true;
      }

      if (nightOwl === 'true') {
        query['lifestyle.nightOwl'] = true;
      }

      // If location and maxDistance provided, use geospatial query
      if (longitude && latitude && maxDistance) {
        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);
        const distance = parseFloat(maxDistance) * 1000; // Convert km to meters

        listings = await Listing.find({
          ...query,
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              $maxDistance: distance,
            },
          },
        });
      } else {
        listings = await Listing.find(query);
      }
    } else {
      // Use mock data
      listings = [...mockListings];

      // Apply filters
      if (q) {
        const searchLower = q.toLowerCase();
        listings = listings.filter(
          (listing) =>
            listing.title.toLowerCase().includes(searchLower) ||
            listing.description.toLowerCase().includes(searchLower)
        );
      }

      if (pureVeg === 'true') {
        listings = listings.filter((listing) => listing.pureVeg === true);
      }

      if (gender && ['Male', 'Female', 'Co-ed'].includes(gender)) {
        listings = listings.filter((listing) => listing.gender === gender);
      }

      if (minPrice) {
        listings = listings.filter(
          (listing) => listing.price >= Number(minPrice)
        );
      }

      if (maxPrice) {
        listings = listings.filter(
          (listing) => listing.price <= Number(maxPrice)
        );
      }

      if (maxDistance) {
        listings = listings.filter(
          (listing) => listing.distance <= Number(maxDistance)
        );
      }

      if (earlyBird === 'true') {
        listings = listings.filter(
          (listing) => listing.lifestyle?.earlyBird === true
        );
      }

      if (nightOwl === 'true') {
        listings = listings.filter(
          (listing) => listing.lifestyle?.nightOwl === true
        );
      }

      // Format mock data
      listings = listings.map(formatMockListing);
    }

    res.json({
      success: true,
      count: listings.length,
      data: listings,
      source: isMongoConnected() ? 'mongodb' : 'mock',
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message,
    });
  }
});

// Get single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let listing;

    if (isMongoConnected()) {
      listing = await Listing.findById(id);
    } else {
      // Use mock data
      listing = mockListings.find((item) => item.id === id);
      if (listing) {
        listing = formatMockListing(listing);
      }
    }

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.json({
      success: true,
      data: listing,
      source: isMongoConnected() ? 'mongodb' : 'mock',
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listing',
      error: error.message,
    });
  }
});

// Create new listing
router.post('/', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please connect MongoDB to create listings.',
        hint: 'Start MongoDB locally or set MONGODB_URI in backend/.env',
      });
    }

    const listingData = {
      ...req.body,
      location: req.body.location || {
        type: 'Point',
        coordinates: [73.8567, 18.5204], // Default Pune coordinates
      },
    };

    // Ensure location is properly formatted
    if (!listingData.location.coordinates) {
      listingData.location = {
        type: 'Point',
        coordinates: [73.8567, 18.5204],
      };
    }

    const listing = await Listing.create(listingData);

    res.status(201).json({
      success: true,
      data: listing,
      message: 'Listing created successfully',
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating listing',
      error: error.message,
    });
  }
});

// Update listing
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating listing',
      error: error.message,
    });
  }
});

// Delete listing (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please connect MongoDB to delete listings.',
      });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    res.json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting listing',
      error: error.message,
    });
  }
});

export default router;
