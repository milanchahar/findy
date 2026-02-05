import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { listingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddListing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    distance: '',
    address: '',
    pureVeg: false,
    gender: 'Co-ed',
    vibe: '',
    amenities: [],
    availableFrom: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to add a listing');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Prepare listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        distance: Number(formData.distance),
        address: formData.address,
        pureVeg: formData.pureVeg,
        gender: formData.gender,
        lifestyle: formData.vibe ? { 
          [formData.vibe === 'Early Bird' ? 'earlyBird' : 'nightOwl']: true 
        } : {},
        amenities: formData.amenities,
        availableFrom: formData.availableFrom,
        image: formData.image,
        contact: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        // Location for GeoJSON (Pune coordinates)
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204], // Default Pune coordinates
        },
      };

      const response = await listingsAPI.create(listingData);
      
      if (response.success) {
        toast.success('Listing created successfully!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to create listing. Please check if backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = ['WiFi', 'Fully Furnished', 'Parking', 'Gym', 'Pool', 'AC', 'Laundry', 'Balcony', 'Concierge'];

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          <span className="uppercase text-sm font-medium tracking-wider">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4">List My Room</h1>
          <p className="text-xl text-gray-400 mb-12">
            Share your space near ADYPU Campus, Pune and find the perfect roommate match.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="border border-white/10 p-8 space-y-6">
              <h2 className="text-2xl font-bold">Basic Information</h2>
              
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  placeholder="e.g., Modern Studio Apartment"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40 resize-none"
                  placeholder="Describe your space..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                    Price (₹ per month) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                    placeholder="12000"
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                    Distance from ADYPU Campus (km) *
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                    placeholder="2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  placeholder="e.g., Charholi Budruk, Lohegaon, Pune"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="border border-white/10 p-8 space-y-6">
              <h2 className="text-2xl font-bold">Preferences</h2>
              
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="pureVeg"
                    checked={formData.pureVeg}
                    onChange={handleChange}
                    className="w-5 h-5 bg-white/5 border border-white/10"
                  />
                  <span className="text-sm uppercase tracking-wider">Pure Vegetarian</span>
                </label>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Gender Preference *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="Co-ed">Co-ed</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Lifestyle Vibe
                </label>
                <select
                  name="vibe"
                  value={formData.vibe}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                >
                  <option value="">Select...</option>
                  <option value="Early Bird">Early Bird</option>
                  <option value="Night Owl">Night Owl</option>
                </select>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Available From *
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="border border-white/10 p-8 space-y-6">
              <h2 className="text-2xl font-bold">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-3 cursor-pointer px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm uppercase tracking-wider">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="border border-white/10 p-8 space-y-6">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full px-12 py-5 bg-white text-black text-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Creating Listing...' : 'Submit Listing'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddListing;
