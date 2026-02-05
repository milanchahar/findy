import Listing from '../models/Listing.js';
import { mockListings } from '../data/mockData.js';

/**
 * Search listings by query string
 * Searches in title and description (case-insensitive)
 */
export const searchItems = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q?.trim() || '';

    // If no query, return trending/default results
    if (!query) {
      const defaultResults = mockListings.slice(0, 6); // Return first 6 as "trending"
      return res.json({
        success: true,
        count: defaultResults.length,
        data: defaultResults,
        message: 'Trending listings',
      });
    }

    // Search in mock data (when MongoDB not connected)
    const searchResults = mockListings.filter((listing) => {
      const searchLower = query.toLowerCase();
      const titleMatch = listing.title.toLowerCase().includes(searchLower);
      const descMatch = listing.description.toLowerCase().includes(searchLower);
      return titleMatch || descMatch;
    });

    res.json({
      success: true,
      count: searchResults.length,
      data: searchResults,
      query: query,
    });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message,
    });
  }
};

/**
 * Advanced search with filters
 * Combines text search with filters
 */
export const advancedSearch = async (req, res) => {
  try {
    const {
      q,
      pureVeg,
      gender,
      minPrice,
      maxPrice,
      maxDistance,
      longitude,
      latitude,
      earlyBird,
      nightOwl,
    } = req.query;

    let results = [...mockListings];

    // Text search
    if (q) {
      const searchLower = q.toLowerCase();
      results = results.filter((listing) => {
        const titleMatch = listing.title.toLowerCase().includes(searchLower);
        const descMatch = listing.description.toLowerCase().includes(searchLower);
        return titleMatch || descMatch;
      });
    }

    // Apply filters
    if (pureVeg === 'true') {
      results = results.filter((listing) => listing.pureVeg === true);
    }

    if (gender && ['Male', 'Female', 'Co-ed'].includes(gender)) {
      results = results.filter((listing) => listing.gender === gender);
    }

    if (minPrice) {
      results = results.filter((listing) => listing.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter((listing) => listing.price <= Number(maxPrice));
    }

    if (maxDistance) {
      results = results.filter(
        (listing) => listing.distance <= Number(maxDistance)
      );
    }

    if (earlyBird === 'true') {
      results = results.filter(
        (listing) => listing.lifestyle?.earlyBird === true
      );
    }

    if (nightOwl === 'true') {
      results = results.filter(
        (listing) => listing.lifestyle?.nightOwl === true
      );
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
      filters: {
        q,
        pureVeg,
        gender,
        minPrice,
        maxPrice,
        maxDistance,
        earlyBird,
        nightOwl,
      },
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing advanced search',
      error: error.message,
    });
  }
};
