import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ListingCard from '../components/ListingCard';
import { Filter, TrendingUp, Users, MapPin, Clock } from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Home = () => {
  const navigate = useNavigate();

  // Refs for GSAP animations
  const statsSectionRef = useRef(null);
  const statsRefs = useRef([]);
  const filtersSectionRef = useRef(null);
  const filterButtonsRef = useRef(null);
  const listingsSectionRef = useRef(null);
  const listingCardsRef = useRef([]);
  const ctaSectionRef = useRef(null);

  // Enhanced sample listing data - Pune, India (ADYPU Campus)
  const allListings = [
    {
      id: 1,
      title: 'Modern Studio Apartment',
      price: 12000,
      distance: 2.5,
      pureVeg: true,
      gender: 'Co-ed',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      vibe: 'Early Bird',
    },
    {
      id: 2,
      title: 'Spacious 2BHK',
      price: 18000,
      distance: 5.2,
      pureVeg: false,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      vibe: 'Night Owl',
    },
    {
      id: 3,
      title: 'Luxury Penthouse Suite',
      price: 25000,
      distance: 1.8,
      pureVeg: true,
      gender: 'Co-ed',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      vibe: 'Early Bird',
    },
    {
      id: 4,
      title: 'Cozy Loft in Charholi',
      price: 14000,
      distance: 3.5,
      pureVeg: false,
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      vibe: 'Night Owl',
    },
    {
      id: 5,
      title: 'Minimalist Studio',
      price: 11000,
      distance: 4.1,
      pureVeg: true,
      gender: 'Co-ed',
      image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
      vibe: 'Early Bird',
    },
    {
      id: 6,
      title: 'Urban Apartment Complex',
      price: 16500,
      distance: 2.9,
      pureVeg: false,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      vibe: 'Night Owl',
    },
  ];

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    pureVeg: false,
    gender: null,
    vibe: null,
    maxPrice: null,
    maxDistance: null,
  });

  // Filter listings based on active filters and search
  const filteredListings = allListings.filter((listing) => {
    // Search filter
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Pure Veg filter
    if (activeFilters.pureVeg && !listing.pureVeg) {
      return false;
    }

    // Gender filter
    if (activeFilters.gender && listing.gender !== activeFilters.gender) {
      return false;
    }

    // Vibe filter
    if (activeFilters.vibe && listing.vibe !== activeFilters.vibe) {
      return false;
    }

    // Price filter
    if (activeFilters.maxPrice && listing.price > activeFilters.maxPrice) {
      return false;
    }

    // Distance filter
    if (activeFilters.maxDistance && listing.distance > activeFilters.maxDistance) {
      return false;
    }

    return true;
  });

  const handleFilterClick = (filterType, value) => {
    setActiveFilters((prev) => {
      if (filterType === 'pureVeg') {
        return { ...prev, pureVeg: !prev.pureVeg };
      }
      if (filterType === 'gender') {
        return { ...prev, gender: prev.gender === value ? null : value };
      }
      if (filterType === 'vibe') {
        return { ...prev, vibe: prev.vibe === value ? null : value };
      }
      if (filterType === 'maxPrice') {
        return { ...prev, maxPrice: prev.maxPrice === value ? null : value };
      }
      if (filterType === 'maxDistance') {
        return { ...prev, maxDistance: prev.maxDistance === value ? null : value };
      }
      return prev;
    });
  };

  const handleGetStarted = () => {
    navigate('/add-listing');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // GSAP ScrollTrigger Animations
  useGSAP(() => {
    // Stats section - bounce animation
    if (statsRefs.current.length > 0) {
      statsRefs.current.forEach((stat, index) => {
        if (stat) {
          gsap.from(stat, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }

    // Filter buttons - stagger slide animation
    if (filterButtonsRef.current) {
      const buttons = filterButtonsRef.current.querySelectorAll('button');
      gsap.from(buttons, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: filterButtonsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Listing cards - 3D flip reveal animation
    if (listingCardsRef.current.length > 0) {
      listingCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            opacity: 0,
            y: 80,
            rotationX: -15,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }

    // CTA section - scale and fade animation
    if (ctaSectionRef.current) {
      gsap.from(ctaSectionRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }, [filteredListings.length]); // Re-run when listing count changes

  return (
    <div className="min-h-screen bg-black">
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Stats Section */}
      <section ref={statsSectionRef} className="border-y border-white/10 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '2.5K+', label: 'Active Users' },
              { icon: MapPin, value: '500+', label: 'Listings' },
              { icon: TrendingUp, value: '98%', label: 'Match Rate' },
              { icon: Clock, value: '<24hrs', label: 'Response Time' },
            ].map((stat, index) => (
              <div
                key={index}
                ref={(el) => (statsRefs.current[index] = el)}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-white/60" />
                <div className="text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section ref={filtersSectionRef} className="py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
          >
            <Filter className="w-6 h-6 text-white" />
            <h2 className="text-3xl font-bold">Smart Filters</h2>
            {Object.values(activeFilters).some(v => v !== null && v !== false) && (
              <button
                onClick={() => setActiveFilters({ pureVeg: false, gender: null, vibe: null, maxPrice: null, maxDistance: null })}
                className="ml-auto text-sm text-gray-400 hover:text-white uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </motion.div>

          <div
            ref={filterButtonsRef}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              onClick={() => handleFilterClick('pureVeg')}
              className={`px-6 py-3 border uppercase text-sm font-medium tracking-wider transition-all rounded-full ${activeFilters.pureVeg
                ? 'bg-white text-black border-white'
                : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Pure Veg
            </motion.button>

            {['Male', 'Female'].map((gender) => (
              <motion.button
                key={gender}
                onClick={() => handleFilterClick('gender', gender)}
                className={`px-6 py-3 border uppercase text-sm font-medium tracking-wider transition-all rounded-full ${activeFilters.gender === gender
                  ? 'bg-white text-black border-white'
                  : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                  }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {gender}
              </motion.button>
            ))}

            <motion.button
              onClick={() => handleFilterClick('maxDistance', 5)}
              className={`px-6 py-3 border uppercase text-sm font-medium tracking-wider transition-all rounded-full ${activeFilters.maxDistance === 5
                ? 'bg-white text-black border-white'
                : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Under 5km
            </motion.button>

            <motion.button
              onClick={() => handleFilterClick('maxPrice', 7000)}
              className={`px-6 py-3 border uppercase text-sm font-medium tracking-wider transition-all rounded-full ${activeFilters.maxPrice === 7000
                ? 'bg-white text-black border-white'
                : 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40'
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Under ₹7,000
            </motion.button>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section ref={listingsSectionRef} className="py-20" data-listings-section>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Available Listings
              {filteredListings.length !== allListings.length && (
                <span className="text-2xl md:text-3xl text-gray-400 ml-4">
                  ({filteredListings.length} found)
                </span>
              )}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Find your perfect roommate near ADYPU Campus, Pune. Every listing is verified and ready for you.
            </p>
          </motion.div>

          {filteredListings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-2xl text-gray-400 mb-4">No listings found</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilters({ pureVeg: false, gender: null, vibe: null, maxPrice: null, maxDistance: null });
                }}
                className="px-6 py-3 border border-white/20 bg-white/5 text-white uppercase text-sm font-medium tracking-wider hover:bg-white/10"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing, index) => {
                // Reset refs array when listings change
                if (!listingCardsRef.current[index]) {
                  listingCardsRef.current[index] = null;
                }
                return (
                  <div
                    key={listing.id}
                    ref={(el) => {
                      if (el) listingCardsRef.current[index] = el;
                    }}
                  >
                    <ListingCard listing={listing} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div ref={ctaSectionRef}>
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              Ready to Find Your
              <br />
              <span className="text-white/60">Perfect Match?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of ADYPU students finding their ideal roommate in Pune through our anti-gravity matching system.
            </p>
            <motion.button
              onClick={handleGetStarted}
              className="px-12 py-5 bg-white text-black text-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
