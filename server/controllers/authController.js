const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

exports.login = async (req, res) => {
  try {
    const { userId, password, captchaVerified } = req.body;

    if (!captchaVerified) {
      return res.status(400).json({ success: false, message: 'Captcha verification failed. Please complete the CAPTCHA.' });
    }

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: 'User ID and password are required.' });
    }

    const cleanUserId = userId.trim().toUpperCase();
    const user = await prisma.user.findUnique({
      where: { userId: cleanUserId }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, userId: user.userId, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        department: user.department,
        batch: user.batch
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { userId, name, password, role, department, batch } = req.body;

    if (!userId || !name || !password) {
      return res.status(400).json({ success: false, message: 'UserId, name, and password are required.' });
    }

    const cleanUserId = userId.trim().toUpperCase();
    const existingUser = await prisma.user.findUnique({
      where: { userId: cleanUserId }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        userId: cleanUserId,
        name: name.trim(),
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'student',
        department: department || 'CSE',
        batch: batch || ''
      },
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        department: true,
        batch: true,
        createdAt: true
      }
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        department: true,
        batch: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};
