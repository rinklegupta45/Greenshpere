const express = require('express');
const {
  createChallenge,
  updateChallenge,
  approveRejectProof,
  createReward,
  updateReward,
  analytics,
  listChallenges,
  listRewards,
  pendingParticipations,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/analytics', analytics);
router.get('/challenges', listChallenges);
router.get('/challenges/pending', pendingParticipations);
router.post('/challenges', createChallenge);
router.put('/challenges/:id', updateChallenge);
router.put('/challenges/:id/participation/:participationId', approveRejectProof);
router.get('/rewards', listRewards);
router.post('/rewards', createReward);
router.put('/rewards/:id', updateReward);

module.exports = router;
