const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:userId', authMiddleware, userController.getUserProfile);
router.put('/:userId', authMiddleware, userController.updateUserProfile);
router.delete('/:userId', authMiddleware, userController.deleteUserProfile);
router.post('/:userId/follow', authMiddleware, userController.followUser);
router.post('/:userId/unfollow', authMiddleware, userController.unfollowUser);

module.exports = router;

