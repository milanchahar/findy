import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const FavoriteButton = ({ listingId }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && listingId) {
      checkFavorite();
    }
  }, [isAuthenticated, listingId]);

  const checkFavorite = async () => {
    try {
      const response = await favoritesAPI.check(listingId);
      setIsFavorited(response.isFavorited);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        await favoritesAPI.remove(listingId);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(listingId);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Error updating favorite');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <motion.button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        isFavorited
          ? 'bg-red-500 text-white'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
    </motion.button>
  );
};

export default FavoriteButton;
