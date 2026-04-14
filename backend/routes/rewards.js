const express = require('express');
const { list, redeem } = require('../controllers/rewardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', list);

router.use(protect);

router.post('/:id/redeem', redeem);

module.exports = router;
