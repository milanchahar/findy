import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ListingCard from '../components/ListingCard';
import {
  Filter, TrendingUp, Users, MapPin, Clock,
  ChevronDown, Home as HomeIcon, Wallet, X
} from 'lucide-react';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Home = () => {
  const navigate = useNavigate();

  // Refs
  const statsSectionRef = useRef(null);
  const statsRefs = useRef([]);
  const listingsSectionRef = useRef(null);
  const listingCardsRef = useRef([]);
  const ctaSectionRef = useRef(null);

  // Enhanced Data
  const allListings = [
    {
      id: 1,
      title: 'Modern Studio Apartment',
      price: 12000,
      distance: 2.5,
      type: 'Studio',
      pureVeg: true,
      gender: 'Co-ed',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', // Realistic cozy apartment interior 
      vibe: 'Early Bird',
      city: 'Pune',
      location: 'Koregaon Park',
    },
    {
      id: 2,
      title: 'Spacious 2BHK',
      price: 18000,
      distance: 5.2,
      type: 'Apartment',
      pureVeg: false,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop', // Standard apartment living room
      vibe: 'Night Owl',
      city: 'Mumbai',
      location: 'Andheri West',
    },
    {
      id: 3,
      title: 'Luxury Penthouse Suite',
      price: 45000,
      distance: 1.8,
      type: 'Apartment',
      pureVeg: true,
      gender: 'Co-ed',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop', // Nice but realistic apartment
      vibe: 'Early Bird',
      city: 'Bangalore',
      location: 'Indiranagar',
    },
    {
      id: 4,
      title: 'Cozy Loft near Tech Park',
      price: 14000,
      distance: 3.5,
      type: 'PG',
      pureVeg: false,
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&auto=format&fit=crop', // Simple room/PG
      vibe: 'Night Owl',
      city: 'Pune',
      location: 'Hinjewadi',
    },
    {
      id: 5,
      title: 'Minimalist Studio',
      price: 11000,
      distance: 4.1,
      type: 'Studio',
      pureVeg: true,
      gender: 'Co-ed',
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop', // Realistic living space
      vibe: 'Early Bird',
      city: 'Delhi',
      location: 'Saket',
    },
    {
      id: 6,
      title: 'Urban Apartment Complex',
      price: 16500,
      distance: 2.9,
      type: 'Apartment',
      pureVeg: false,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop', // Modest apartment
      vibe: 'Night Owl',
      city: 'Hyderabad',
      location: 'Gachibowli',
    },
    {
      id: 7,
      title: 'City View Apartment',
      price: 35000,
      distance: 1.2,
      type: 'Apartment',
      pureVeg: true,
      gender: 'Female',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop', // Kitchen/Living area
      vibe: 'Chill',
      city: 'Mumbai',
      location: 'Bandra',
    },
    {
      id: 8,
      title: 'Student Friendly PG',
      price: 8000,
      distance: 0.5,
      type: 'PG',
      pureVeg: false,
      gender: 'Male',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop', // Simple bedroom/student room
      vibe: 'Party',
      city: 'Pune',
      location: 'Viman Nagar',
    },
  ];

  // Unique Data for Dropdowns
  const cities = [...new Set(allListings.map(item => item.city))];
  const propertyTypes = [...new Set(allListings.map(item => item.type))];

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: 'All',
    type: 'All',
    priceRange: 'All', // 'Under 10k', '10k-20k', '20k+'
    gender: 'All',
    pureVeg: false,
  });

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveDropdown(null);
  };

  const filteredListings = allListings.filter((listing) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        listing.title.toLowerCase().includes(q) ||
        listing.city.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q);
      if (!match) return false;
    }

    // City
    if (filters.city !== 'All' && listing.city !== filters.city) return false;

    // Type
    if (filters.type !== 'All' && listing.type !== filters.type) return false;

    // Gender
    if (filters.gender !== 'All' && listing.gender !== filters.gender) return false;

    // Pure Veg
    if (filters.pureVeg && !listing.pureVeg) return false;

    // Price
    if (filters.priceRange !== 'All') {
      if (filters.priceRange === 'Under ₹10k' && listing.price >= 10000) return false;
      if (filters.priceRange === '₹10k - ₹20k' && (listing.price < 10000 || listing.price > 20000)) return false;
      if (filters.priceRange === 'Above ₹20k' && listing.price <= 20000) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({
      city: 'All',
      type: 'All',
      priceRange: 'All',
      gender: 'All',
      pureVeg: false,
    });
    setSearchQuery('');
  };

  const hasActiveFilters =
    filters.city !== 'All' ||
    filters.type !== 'All' ||
    filters.priceRange !== 'All' ||
    filters.gender !== 'All' ||
    filters.pureVeg;


  const handleGetStarted = () => navigate('/add-listing');

  // GSAP
  useGSAP(() => {
    // Stats
    if (statsRefs.current.length > 0) {
      statsRefs.current.forEach((stat) => {
        if (stat) {
          gsap.from(stat, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });
    }

    // Listing Cards
    if (listingCardsRef.current.length > 0) {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger && t.trigger.classList && t.trigger.classList.contains('listing-card-wrapper')) {
          t.kill();
        }
      });

      listingCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index % 3 * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 95%',
                end: 'bottom 10%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
    }
  }, [filteredListings.length]);

  // Dropdown Component Helper
  const FilterDropdown = ({ title, icon: Icon, activeValue, options, type }) => (
    <div className="relative filter-dropdown">
      <button
        onClick={() => setActiveDropdown(activeDropdown === type ? null : type)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${activeDropdown === type || activeValue !== 'All'
          ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
          }`}
      >
        <Icon size={16} />
        <span>{activeValue === 'All' ? title : activeValue}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === type ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {activeDropdown === type && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-1">
              <button
                onClick={() => handleFilterChange(type, 'All')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeValue === 'All' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                All
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange(type, option)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeValue === option ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Stats Section */}
      <section ref={statsSectionRef} className="border-y border-white/10 py-12 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: '25K+', label: 'Active Users' },
              { icon: MapPin, value: '120+', label: 'Cities' },
              { icon: TrendingUp, value: '98%', label: 'Match Rate' },
              { icon: Clock, value: '<24hrs', label: 'Response Time' },
            ].map((stat, index) => (
              <div
                key={index}
                ref={(el) => (statsRefs.current[index] = el)}
                className="text-center group"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                    <stat.icon className="w-5 h-5 text-white/80" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Filter Bar Section */}
      <section className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">

            {/* Left: Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-white/50 pr-4 border-r border-white/10 mr-1">
                <Filter size={18} />
                <span className="text-sm font-medium uppercase tracking-wide">Filters</span>
              </div>

              {/* City Dropdown */}
              <FilterDropdown
                title="City"
                icon={MapPin}
                activeValue={filters.city}
                options={cities}
                type="city"
              />

              {/* Type Dropdown */}
              <FilterDropdown
                title="Property Type"
                icon={HomeIcon}
                activeValue={filters.type}
                options={propertyTypes}
                type="type"
              />

              {/* Price Dropdown */}
              <FilterDropdown
                title="Budget"
                icon={Wallet}
                activeValue={filters.priceRange}
                options={['Under \u20B910k', '\u20B910k - \u20B920k', 'Above \u20B920k']}
                type="priceRange"
              />

              {/* Gender Dropdown */}
              <FilterDropdown
                title="Gender"
                icon={Users}
                activeValue={filters.gender}
                options={['Male', 'Female', 'Co-ed']}
                type="gender"
              />

              {/* Pure Veg Toggle Pill */}
              <button
                onClick={() => handleFilterChange('pureVeg', !filters.pureVeg)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${filters.pureVeg
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                  }`}
              >
                <div className={`w-2 h-2 rounded-full ${filters.pureVeg ? 'bg-current' : 'bg-gray-500'}`} />
                <span>Pure Veg</span>
              </button>
            </div>

            {/* Right: Clear & Count */}
            <div className="flex items-center gap-4 ml-auto">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white font-bold">{filteredListings.length}</span>
                <span className="text-gray-500 text-sm ml-2">Results</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section ref={listingsSectionRef} className="py-12 min-h-[60vh] bg-black" data-listings-section>
        <div className="container mx-auto px-6">

          {filteredListings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm mx-auto max-w-2xl"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Filter size={32} className="text-white/40" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No matches found</h3>
              <p className="text-gray-400 mb-8 max-w-md">
                We couldn't find any listings matching your current filters. Try adjusting your search or clearing some filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-xl"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {filteredListings.map((listing, index) => (
                <div
                  key={listing.id}
                  ref={(el) => {
                    if (el) listingCardsRef.current[index] = el;
                  }}
                  className="listing-card-wrapper"
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-white/10 bg-gradient-to-b from-black to-white/5">
        <div className="container mx-auto px-6 text-center">
          <div ref={ctaSectionRef}>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Ready to Upgrade
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Your Living?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of people finding their ideal homes and roommates across India through our intelligent matching system.
            </p>
            <motion.button
              onClick={handleGetStarted}
              className="px-12 py-5 bg-white text-black text-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] rounded-full"
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
