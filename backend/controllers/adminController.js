const Challenge = require('../models/Challenge');
const Reward = require('../models/Reward');
const User = require('../models/User');
const Post = require('../models/Post');

exports.createChallenge = async (req, res) => {
  try {
    const { title, description, pointsReward, deadline, requiresProof } = req.body;
    const challenge = await Challenge.create({
      title,
      description,
      pointsReward: Number(pointsReward) || 0,
      deadline: new Date(deadline),
      requiresProof: !!requiresProof,
      createdBy: req.user.id,
    });
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRejectProof = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    const part = challenge.participations.id(req.params.participationId);
    if (!part) return res.status(404).json({ message: 'Participation not found' });
    part.status = status;
    if (status === 'approved') {
      await User.findByIdAndUpdate(part.userId, { $inc: { points: challenge.pointsReward } });
    }
    await challenge.save();
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReward = async (req, res) => {
  try {
    const { title, description, pointsCost, stock, type } = req.body;
    const reward = await Reward.create({
      title,
      description: description || '',
      pointsCost: Number(pointsCost) || 0,
      stock: Number(stock) || 0,
      type: type || 'other',
    });
    res.status(201).json(reward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reward) return res.status(404).json({ message: 'Reward not found' });
    res.json(reward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.analytics = async (req, res) => {
  try {
    const [totalUsers, totalPosts, pendingChallenges] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Challenge.aggregate([
        { $unwind: '$participations' },
        { $match: { 'participations.status': 'pending' } },
        { $count: 'count' },
      ]).then((r) => r[0]?.count || 0),
    ]);
    const pendingVerifications = await Challenge.find({
      'participations.status': 'pending',
    }).countDocuments();
    res.json({
      totalUsers,
      totalPosts,
      pendingVerifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.pendingParticipations = async (req, res) => {
  try {
    const challenges = await Challenge.find({ 'participations.status': 'pending' })
      .populate('createdBy', 'name')
      .populate('participations.userId', 'name avatar email');
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
