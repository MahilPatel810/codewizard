const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { userId, password, captchaVerified } = req.body;
    if (!captchaVerified) {
      return res.status(400).json({ success: false, message: 'Captcha verification failed.' });
    }
    const user = await User.findOne({ userId: userId.toUpperCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, userId: user.userId, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department,
        batch: user.batch
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { userId, name, password, role, department, batch } = req.body;
    const existingUser = await User.findOne({ userId: userId.toUpperCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({ userId: userId.toUpperCase(), name, password, role, department, batch });
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department,
        batch: user.batch
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
