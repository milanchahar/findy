import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ReviewSection = ({ listingId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByListing(listingId);
      setReviews(response.data);
      setAverageRating(response.averageRating);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    try {
      await reviewsAPI.create(listingId, formData.rating, formData.comment);
      toast.success('Review submitted!');
      setShowForm(false);
      setFormData({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      toast.error('Error submitting review');
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reviews</h2>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" size={20} fill="currentColor" />
            <span className="text-xl font-bold">{averageRating}</span>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>
        {isAuthenticated && (
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 border border-white/20 bg-white/5 text-white uppercase text-sm font-medium tracking-wider hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Write Review
          </motion.button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          className="mb-8 p-6 border border-white/10 bg-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-2xl"
                >
                  <Star
                    size={32}
                    fill={star <= formData.rating ? '#fbbf24' : 'none'}
                    className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-400'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
              Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex gap-4">
            <motion.button
              type="submit"
              className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Review
            </motion.button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-white/20 bg-white/5 text-white uppercase text-sm font-medium tracking-wider hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            className="p-6 border border-white/10 bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold">{review.user?.name || 'Anonymous'}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= review.rating ? '#fbbf24' : 'none'}
                      className={star <= review.rating ? 'text-yellow-400' : 'text-gray-400'}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.comment && (
              <p className="text-gray-300">{review.comment}</p>
            )}
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="mx-auto mb-4" size={48} />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
