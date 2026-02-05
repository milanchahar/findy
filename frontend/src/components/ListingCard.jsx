import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Sun, Moon } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <motion.div
      className="bg-white/5 border border-white/10 overflow-hidden group cursor-pointer h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)',
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {listing.pureVeg && (
            <motion.span
              className="px-3 py-1.5 bg-green-500 text-black text-xs font-black uppercase tracking-wider"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Pure Veg
            </motion.span>
          )}
          <motion.span
            className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {listing.gender}
          </motion.span>
          {listing.vibe && (
            <motion.span
              className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20 flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {listing.vibe === 'Early Bird' ? (
                <>
                  <Sun size={12} />
                  {listing.vibe}
                </>
              ) : (
                <>
                  <Moon size={12} />
                  {listing.vibe}
                </>
              )}
            </motion.span>
          )}
        </div>

        {/* Price Badge & Favorite */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <FavoriteButton listingId={listing.id} />
          <motion.div
            className="px-4 py-2 bg-black/80 backdrop-blur-md text-white font-black text-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            ₹{listing.price.toLocaleString('en-IN')}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-black mb-4 group-hover:text-white/90 transition-colors">
          {listing.title}
        </h3>
        
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center gap-3 text-gray-400">
            <MapPin size={18} className="text-white/60" />
            <span className="text-sm">{listing.distance} km from ADYPU Campus</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-400">
            <Users size={18} className="text-white/60" />
            <span className="text-sm">Roommate matching available</span>
          </div>
        </div>

        {/* Hover effect indicator */}
        <motion.div
          className="pt-6 border-t border-white/10 flex items-center justify-between"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
        >
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            View Details
          </span>
          <motion.span
            className="text-white"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
