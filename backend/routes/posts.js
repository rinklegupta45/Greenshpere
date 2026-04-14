const express = require('express');
const {
  createPost,
  deletePost,
  likePost,
  addComment,
  getFeed,
  getUserPosts,
  getPostById,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/', uploadSingle, createPost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.post('/:id/comment', addComment);
router.get('/feed', getFeed);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);

module.exports = router;
