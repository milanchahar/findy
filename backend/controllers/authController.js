import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { mockUsers } from '../data/mockData.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if MongoDB is connected
    const mongoose = (await import('mongoose')).default;
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB not connected. Using MOCK registration.');

      // Mock registration response
      const mockUser = {
        _id: 'mock_' + Date.now(),
        name,
        email,
        phone,
        role: 'user',
        preferences: {
          pureVeg: false,
          gender: 'Co-ed',
          lifestyle: { earlyBird: false, nightOwl: false }
        }
      };

      const token = generateToken(mockUser._id);

      return res.status(201).json({
        success: true,
        token,
        data: mockUser,
        message: 'Registered in Mock Mode (Data will not persist)'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if MongoDB is connected
    const mongoose = (await import('mongoose')).default;
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB not connected. Using MOCK login.');

      // Check against mock users
      const mockUser = mockUsers.find(u => u.email === email);

      // For demo purposes, we accept the mock user password OR any password for "demo@example.com"
      // In a real scenario, checks would be stricter, but for mock debugging, this is helpful.
      if (mockUser && (password === 'password123' || mockUser.email === 'demo@example.com')) {
        const token = generateToken(mockUser._id);
        return res.json({
          success: true,
          token,
          data: mockUser,
          message: 'Logged in using Mock Mode'
        });
      }

      // Allow simple "create-on-fly" mock login for testing if not found in static list
      // This is helpful if they just registered in the same session (though ideally we'd store that in memory)
      // Since we can't easily share memory across requests in this structure reliably without a global object:
      // We will just fail if strictly not in mockUsers to avoid confusion, 
      // UNLESS we want to allow *any* login in mock mode. Let's allow any login for ease of use.

      const token = generateToken('mock_adhoc_' + Date.now());
      return res.json({
        success: true,
        token,
        data: {
          _id: 'mock_adhoc_' + Date.now(),
          name: 'Adhoc User',
          email: email,
          role: 'user'
        },
        message: 'Logged in using Mock Mode (Adhoc User)'
      });
    }

    // Check user and password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      data: user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const mongoose = (await import('mongoose')).default;
    if (mongoose.connection.readyState !== 1) {
      // Mock Response
      const mockUser = mockUsers.find(u => u._id === req.user.id) || {
        _id: req.user.id,
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'user'
      };
      return res.json({
        success: true,
        data: mockUser
      });
    }

    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar,
      preferences: req.body.preferences,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};
