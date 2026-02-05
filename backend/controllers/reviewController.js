import Review from '../models/Review.js';
import Listing from '../models/Listing.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    if (!listingId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listing ID and rating',
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({
      listing: listingId,
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this listing',
      });
    }

    const review = await Review.create({
      listing: listingId,
      user: req.user.id,
      rating,
      comment,
    });

    // Update listing average rating
    await updateListingRating(listingId);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message,
    });
  }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
export const getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    // Calculate average rating
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: reviews.length > 0 ? avgRating.toFixed(1) : 0,
      data: reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

// @desc    Update listing average rating
const updateListingRating = async (listingId) => {
  const reviews = await Review.find({ listing: listingId });
  const avgRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await Listing.findByIdAndUpdate(listingId, {
    averageRating: avgRating.toFixed(1),
    reviewCount: reviews.length,
  });
};
