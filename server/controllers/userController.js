// server/controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// -------------------- REGISTER --------------------
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Return safe user object
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ user: safeUser });
  } catch (err) {
    next(err);
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return safe user object + token
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

// -------------------- GOOGLE LOGIN --------------------
export const googleLogin = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      // If not, create a new user
      user = await User.create({
        name,
        email,
        password: googleId, // store googleId as password placeholder
        authProvider: 'google'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
};

// -------------------- GET USER PROFILE --------------------
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId; // set from auth middleware
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
};
