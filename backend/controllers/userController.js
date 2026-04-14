const User = require('../models/User');
const Post = require('../models/Post');

const getEcoLevel = (points) => {
  if (points >= 500) return 'Forest Guardian';
  if (points >= 100) return 'Oak';
  return 'Seedling';
};

const getImageUrl = (file, baseUrl) => {
  if (!file) return '';
  if (file.path && file.path.startsWith('http')) return file.path;
  const base = baseUrl || process.env.API_URL || 'http://localhost:5000';
  return base + '/uploads/' + (file.filename || file.originalname || '');
};

const uploadToCloudinary = (buffer) => {
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'greensphere' }, (err, res) => (err ? reject(err) : resolve(res)));
    stream.end(buffer);
  });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const postCount = await Post.countDocuments({ userId: user._id });
    const isFollowing = req.user && user.followers.some((id) => id.toString() === req.user.id);
    res.json({
      ...user,
      postCount,
      ecoLevel: getEcoLevel(user.points),
      isFollowing: !!isFollowing,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const { name, bio } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (req.file) {
      if (req.file.buffer && process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await uploadToCloudinary(req.file.buffer);
        update.avatar = result.secure_url;
      } else {
        update.avatar = getImageUrl(req.file, req.protocol + '://' + req.get('host'));
      }
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.follow = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user.id) return res.status(400).json({ message: 'Cannot follow yourself' });
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const me = await User.findById(req.user.id);
    const alreadyFollowing = me.following.some((id) => id.toString() === targetId);
    if (alreadyFollowing) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $pull: { followers: req.user.id } });
      return res.json({ message: 'Unfollowed', following: false });
    }
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: req.user.id } });
    res.json({ message: 'Followed', following: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const top = await User.find().select('name avatar points badges').sort({ points: -1 }).limit(50).lean();
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
