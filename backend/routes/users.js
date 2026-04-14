const express = require('express');
const { getProfile, updateProfile, follow, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);

router.use(protect);

router.get('/profile/:id', getProfile);
router.put('/profile/:id', uploadAvatar, updateProfile);
router.put('/follow/:id', follow);

module.exports = router;
