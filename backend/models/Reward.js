const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  redeemedAt: { type: Date, default: Date.now },
});

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  pointsCost: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  type: { type: String, enum: ['badge', 'coupon', 'certificate', 'other'], default: 'other' },
  redemptions: [redemptionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
