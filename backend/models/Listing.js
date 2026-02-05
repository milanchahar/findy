import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // GeoJSON Point for location-based queries
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (coords) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && // longitude
                   coords[1] >= -90 && coords[1] <= 90;     // latitude
          },
          message: 'Invalid coordinates. Must be [longitude, latitude]',
        },
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    // Search filters
    pureVeg: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Co-ed'],
      required: true,
    },
    // Roommate matching - Vibe Check
    lifestyle: {
      earlyBird: {
        type: Boolean,
        default: false,
      },
      nightOwl: {
        type: Boolean,
        default: false,
      },
    },
    // Additional details
    images: [{
      type: String,
      url: String,
    }],
    amenities: [{
      type: String,
    }],
    availableFrom: {
      type: Date,
    },
    contact: {
      name: String,
      email: String,
      phone: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Reviews and ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Owner reference
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
listingSchema.index({ location: '2dsphere' });

// Index for common search queries
listingSchema.index({ pureVeg: 1, gender: 1, price: 1 });
listingSchema.index({ isActive: 1 });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
