const Post = require('../models/Post');
const User = require('../models/User');

const ECO_POINTS = { tree_plantation: 50, recycling: 30, cleanup: 40, cycling: 20, other: 10 };

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

exports.createPost = async (req, res) => {
  try {
    const { caption, location, ecoCategory } = req.body;
    let imageUrl = '';
    if (req.file) {
      if (req.file.buffer && process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      } else {
        imageUrl = getImageUrl(req.file, req.protocol + '://' + req.get('host'));
      }
    }
    const pointsAwarded = ECO_POINTS[ecoCategory] || 0;
    const post = await Post.create({
      userId: req.user.id,
      caption: caption || '',
      imageUrl,
      location: location || '',
      ecoCategory: ecoCategory || '',
      pointsAwarded,
    });
    if (pointsAwarded > 0) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: pointsAwarded } });
    }
    const populated = await Post.findById(post._id).populate('userId', 'name avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.pointsAwarded > 0) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: -post.pointsAwarded } });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const hasLiked = post.likes.some((id) => id.toString() === req.user.id);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ userId: req.user.id, text });
    await post.save();
    const updated = await Post.findById(post._id).populate('comments.userId', 'name avatar');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id);
    const followingIds = [...(user.following || []), req.user.id];
    
    const feed = await Post.find({ userId: { $in: followingIds } })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const trending = page === 1 ? await Post.find({ userId: { $nin: followingIds } })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean() : [];
      
    res.json({ feed, trending, hasMore: feed.length === limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name avatar').populate('comments.userId', 'name avatar').lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
