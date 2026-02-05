import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Users, Sun, Moon, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import FavoriteButton from '../components/FavoriteButton';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../services/api';
import { toast } from 'react-hot-toast';

// Sample data - Pune, India (ADYPU Campus) - in real app, this would come from API
const sampleListings = {
  1: {
    id: 1,
    title: 'Modern Studio Apartment',
    price: 12000,
    distance: 2.5,
    pureVeg: true,
    gender: 'Co-ed',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    vibe: 'Early Bird',
    description: 'Beautiful modern studio apartment located just 2.5km from ADYPU Campus. Perfect for students looking for a clean, minimalist living space. Fully furnished with all amenities.',
    address: 'Near Charholi Budruk, Lohegaon, Pune, Maharashtra 412105',
    amenities: ['WiFi', 'Fully Furnished', 'Parking', 'Laundry', 'AC'],
    contact: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
    },
    availableFrom: '2024-02-01',
  },
  2: {
    id: 2,
    title: 'Spacious 2BHK',
    price: 18000,
    distance: 5.2,
    pureVeg: false,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    vibe: 'Night Owl',
    description: 'Spacious 2-bedroom apartment perfect for sharing. Great location with easy access to public transport. Modern amenities and friendly neighborhood.',
    address: 'Wagholi, Pune, Maharashtra 412207',
    amenities: ['WiFi', 'Fully Furnished', 'Parking', 'Gym Access', 'AC', 'Balcony'],
    contact: {
      name: 'Rahul Patil',
      email: 'rahul.patil@example.com',
      phone: '+91 98765 43211',
    },
    availableFrom: '2024-02-15',
  },
  3: {
    id: 3,
    title: 'Luxury Penthouse Suite',
    price: 25000,
    distance: 1.8,
    pureVeg: true,
    gender: 'Co-ed',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    vibe: 'Early Bird',
    description: 'Premium penthouse suite with stunning city views. Luxury amenities and premium location near ADYPU. Perfect for those who appreciate quality living.',
    address: 'Charholi Budruk, Near ADYPU Campus, Pune, Maharashtra 412105',
    amenities: ['WiFi', 'Fully Furnished', 'Parking', 'Gym', 'Pool', 'AC', 'Concierge'],
    contact: {
      name: 'Ananya Desai',
      email: 'ananya.desai@example.com',
      phone: '+91 98765 43212',
    },
    availableFrom: '2024-03-01',
  },
  4: {
    id: 4,
    title: 'Cozy Loft in Charholi',
    price: 14000,
    distance: 3.5,
    pureVeg: false,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    vibe: 'Night Owl',
    description: 'Charming loft with character in Charholi area. Great for creative individuals. Close to cafes, restaurants, and local markets.',
    address: 'Charholi Budruk, Lohegaon, Pune, Maharashtra 412105',
    amenities: ['WiFi', 'Partially Furnished', 'Parking', 'AC'],
    contact: {
      name: 'Kavya Joshi',
      email: 'kavya.joshi@example.com',
      phone: '+91 98765 43213',
    },
    availableFrom: '2024-02-20',
  },
  5: {
    id: 5,
    title: 'Minimalist Studio',
    price: 11000,
    distance: 4.1,
    pureVeg: true,
    gender: 'Co-ed',
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    vibe: 'Early Bird',
    description: 'Clean, minimalist studio perfect for focused students. Quiet neighborhood near ADYPU, great study environment.',
    address: 'Lohegaon, Pune, Maharashtra 412105',
    amenities: ['WiFi', 'Fully Furnished', 'Parking', 'AC', 'Study Desk'],
    contact: {
      name: 'Arjun Singh',
      email: 'arjun.singh@example.com',
      phone: '+91 98765 43214',
    },
    availableFrom: '2024-02-10',
  },
  6: {
    id: 6,
    title: 'Urban Apartment Complex',
    price: 16500,
    distance: 2.9,
    pureVeg: false,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    vibe: 'Night Owl',
    description: 'Modern apartment in vibrant urban complex near ADYPU. Great community feel, lots of amenities, perfect for social students.',
    address: 'Lohegaon, Near ADYPU Campus, Pune, Maharashtra 412105',
    amenities: ['WiFi', 'Fully Furnished', 'Parking', 'Gym', 'AC', 'Rooftop'],
    contact: {
      name: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
      phone: '+91 98765 43215',
    },
    availableFrom: '2024-02-25',
  },
};

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const listing = sampleListings[id];

  const [showContact, setShowContact] = useState(false);

  const handleMessage = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to message');
      navigate('/login');
      return;
    }

    try {
      // Create or get conversation
      const response = await messagesAPI.createConversation(
        listing.contact.email, // In real app, use owner ID
        id
      );
      navigate('/messages');
    } catch (error) {
      toast.error('Error starting conversation');
    }
  };

  if (!listing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Listing Not Found</h1>
          <Link to="/" className="text-white/60 hover:text-white underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-6 py-8">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          <span className="uppercase text-sm font-medium tracking-wider">Back</span>
        </motion.button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <motion.img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Tags Overlay */}
        <div className="absolute top-8 left-8 flex flex-wrap gap-3">
          {listing.pureVeg && (
            <span className="px-4 py-2 bg-green-500 text-black text-sm font-black uppercase tracking-wider">
              Pure Veg
            </span>
          )}
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-black uppercase tracking-wider border border-white/30">
            {listing.gender}
          </span>
          {listing.vibe && (
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm font-black uppercase tracking-wider border border-white/20 flex items-center gap-2">
              {listing.vibe === 'Early Bird' ? <Sun size={16} /> : <Moon size={16} />}
              {listing.vibe}
            </span>
          )}
        </div>

        {/* Price Badge & Favorite */}
        <div className="absolute top-8 right-8 flex items-center gap-3">
          <FavoriteButton listingId={id} />
          <div className="px-6 py-3 bg-black/80 backdrop-blur-md text-white font-black text-3xl">
            ₹{listing.price.toLocaleString('en-IN')}<span className="text-lg">/mo</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.h1
              className="text-5xl md:text-6xl font-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {listing.title}
            </motion.h1>

            <motion.div
              className="space-y-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 text-gray-400">
                <MapPin size={20} />
                <span>{listing.address}</span>
                <span className="text-white/20">•</span>
                <span>{listing.distance} km from ADYPU Campus</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed">{listing.description}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 border border-white/10 bg-white/5 text-sm uppercase tracking-wider"
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Available From</h2>
                <p className="text-gray-300">{new Date(listing.availableFrom).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Contact */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24 border border-white/10 bg-white/5 p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Contact</h2>
              
              {!showContact ? (
                <div className="space-y-3">
                  <motion.button
                    onClick={() => setShowContact(true)}
                    className="w-full px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Show Contact Info
                  </motion.button>
                  {isAuthenticated && (
                    <motion.button
                      onClick={handleMessage}
                      className="w-full px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MessageCircle size={20} />
                      Message Owner
                    </motion.button>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Name</p>
                    <p className="text-white font-medium">{listing.contact.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Email</p>
                    <a
                      href={`mailto:${listing.contact.email}`}
                      className="text-white hover:text-gray-300 flex items-center gap-2"
                    >
                      <Mail size={16} />
                      {listing.contact.email}
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Phone</p>
                    <a
                      href={`tel:${listing.contact.phone}`}
                      className="text-white hover:text-gray-300 flex items-center gap-2"
                    >
                      <Phone size={16} />
                      {listing.contact.phone}
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-6 pb-16">
          <ReviewSection listingId={id} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
