const Challenge = require('../models/Challenge');
const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.join = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    if (new Date() > new Date(challenge.deadline)) return res.status(400).json({ message: 'Challenge has ended' });
    const existing = challenge.participations.find((p) => p.userId.toString() === req.user.id);
    if (existing) return res.status(400).json({ message: 'Already joined' });
    const { proofUrl, proofText } = req.body || {};
    challenge.participations.push({
      userId: req.user.id,
      proofUrl: proofUrl || '',
      proofText: proofText || '',
      status: challenge.requiresProof ? 'pending' : 'approved',
    });
    if (!challenge.requiresProof) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: challenge.pointsReward } });
    }
    await challenge.save();
    const updated = await Challenge.findById(challenge._id).populate('createdBy', 'name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitProof = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    const part = challenge.participations.find((p) => p.userId.toString() === req.user.id);
    if (!part) return res.status(400).json({ message: 'Not participating' });
    const { proofUrl, proofText } = req.body || {};
    if (proofUrl !== undefined) part.proofUrl = proofUrl;
    if (proofText !== undefined) part.proofText = proofText;
    part.status = 'pending';
    await challenge.save();
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyParticipations = async (req, res) => {
  try {
    const challenges = await Challenge.find({ 'participations.userId': req.user.id })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
