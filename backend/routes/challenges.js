const express = require('express');
const { list, join, submitProof, getMyParticipations } = require('../controllers/challengeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', list);

router.use(protect);

router.post('/:id/join', join);
router.put('/:id/proof', submitProof);
router.get('/my', getMyParticipations);

module.exports = router;
