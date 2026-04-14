const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

const getEcoLevel = (points) => {
  if (points >= 500) return 'Forest Guardian';
  if (points >= 100) return 'Oak';
  return 'Seedling';
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, points: user.points, ecoLevel: getEcoLevel(user.points) }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = generateToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, points: user.points, ecoLevel: getEcoLevel(user.points) }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, points: user.points, ecoLevel: getEcoLevel(user.points) } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
