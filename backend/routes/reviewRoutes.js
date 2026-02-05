import express from 'express';
import {
  createReview,
  getListingReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/listing/:listingId', getListingReviews);

export default router;
