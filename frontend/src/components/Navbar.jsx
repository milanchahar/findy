import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/add-listing', label: 'List My Room', icon: Plus },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter cursor-pointer">
            FINDYY
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 uppercase text-sm font-medium tracking-wider transition-colors cursor-pointer ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/10 border border-white/20"
                      layoutId="navbar-active"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}

            {/* Auth Links - Simplified for Guest Mode */}
            <Link
              to="/messages"
              className="px-4 py-2 uppercase text-sm font-medium tracking-wider text-gray-400 hover:text-white transition-colors"
            >
              Messages
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 uppercase text-sm font-medium tracking-wider text-gray-400">
              <User size={18} />
              <span>Guest</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
