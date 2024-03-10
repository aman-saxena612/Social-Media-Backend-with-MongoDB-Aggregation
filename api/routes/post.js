const express = require('express');
const router = express.Router();
const postController = require('../controller/post');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.put('/:postId', authMiddleware, postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);
router.get('/latest', authMiddleware, postController.getLatestPosts);

module.exports = router;
