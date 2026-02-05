import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const Hero = ({ searchQuery, setSearchQuery }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    // Scroll to listings section
    const listingsSection = document.querySelector('[data-listings-section]');
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Floating title animation */}
          <motion.h1
            className="text-8xl md:text-[12rem] font-black mb-8 tracking-tighter leading-none"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            FINDYY
          </motion.h1>
          
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-2xl md:text-3xl text-gray-300 mb-2 font-medium">
              The Anti-Gravity
            </p>
            <p className="text-xl md:text-2xl text-gray-500 uppercase tracking-[0.3em]">
              Roommate Finder for ADYPU, Pune
            </p>
          </motion.div>

          {/* Search bar with magnetic hover */}
          <motion.div
            className="max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <form onSubmit={handleSearch}>
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="text"
                  placeholder="Search for your perfect roommate near ADYPU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-8 py-6 pl-16 pr-20 bg-white/5 border-2 border-white/10 rounded-none text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-all text-lg"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" size={24} />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <span className="uppercase tracking-wider">2,500+ Active Users</span>
            <span className="text-white/20">•</span>
            <span className="uppercase tracking-wider">500+ Verified Listings</span>
            <span className="text-white/20">•</span>
            <span className="uppercase tracking-wider">98% Match Rate</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={() => {
          const listingsSection = document.querySelector('[data-listings-section]');
          if (listingsSection) {
            listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-4 bg-white/60 rounded-full"
            animate={{
              y: [0, 14, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
