import Favorite from '../models/Favorite.js';
import Listing from '../models/Listing.js';

// @desc    Add listing to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide listing ID',
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

    // Check if already favorited
    const existing = await Favorite.findOne({
      user: req.user.id,
      listing: listingId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Listing already in favorites',
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      listing: listingId,
    });

    res.status(201).json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message,
    });
  }
};

// @desc    Remove listing from favorites
// @route   DELETE /api/favorites/:listingId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      listing: req.params.listingId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message,
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('listing')
      .sort('-createdAt');

    res.json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message,
    });
  }
};

// @desc    Check if listing is favorited
// @route   GET /api/favorites/check/:listingId
// @access  Private
export const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      listing: req.params.listingId,
    });

    res.json({
      success: true,
      isFavorited: !!favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking favorite',
      error: error.message,
    });
  }
};
