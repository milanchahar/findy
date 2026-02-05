import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ArrowLeft, User, Mail, Lock, Phone } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black pt-20 flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="uppercase text-sm font-medium tracking-wider">Back</span>
        </Link>

        <h1 className="text-5xl md:text-6xl font-black mb-4">Sign Up</h1>
        <p className="text-xl text-gray-400 mb-12">
          Join Findyy and find your perfect roommate
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
              Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                placeholder="Your Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/40"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full px-12 py-5 bg-white text-black text-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
