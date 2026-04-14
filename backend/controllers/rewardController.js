const Reward = require('../models/Reward');
const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    const rewards = await Reward.find({ stock: { $gt: 0 } }).sort({ pointsCost: 1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.redeem = async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ message: 'Reward not found' });
    if (reward.stock < 1) return res.status(400).json({ message: 'Out of stock' });
    const user = await User.findById(req.user.id);
    if (user.points < reward.pointsCost) return res.status(400).json({ message: 'Insufficient points' });
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: -reward.pointsCost },
      $addToSet: { badges: reward.title },
    });
    reward.stock -= 1;
    reward.redemptions.push({ userId: req.user.id });
    await reward.save();
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json({ message: 'Redeemed successfully', user: updatedUser, reward });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
