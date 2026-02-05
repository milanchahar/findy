import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', addFavorite);
router.delete('/:listingId', removeFavorite);
router.get('/', getFavorites);
router.get('/check/:listingId', checkFavorite);

export default router;
