const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proofUrl: { type: String, default: '' },
  proofText: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
});

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pointsReward: { type: Number, required: true, default: 0 },
  deadline: { type: Date, required: true },
  requiresProof: { type: Boolean, default: false },
  participations: [participationSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
