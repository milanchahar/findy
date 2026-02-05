import express from 'express';
import { searchItems, advancedSearch } from '../controllers/searchController.js';

const router = express.Router();

/**
 * GET /api/search
 * Simple search by query parameter 'q'
 * Example: /api/search?q=modern
 */
router.get('/', searchItems);

/**
 * GET /api/search/advanced
 * Advanced search with multiple filters
 * Example: /api/search/advanced?q=studio&pureVeg=true&maxPrice=15000
 */
router.get('/advanced', advancedSearch);

export default router;
