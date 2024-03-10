// const express = require('express');
// const router = express.Router();
// const userController = require('../controller/user.js'); // Assuming userController handles user logic

// // ... other imports (middleware for JWT verification)

// router.post('/signup', userController.createUser);  // Create user
// router.get('/users/:userId', userController.getUser); // Get user by ID
// router.put('/users/:userId', userController.updateUser); // Update user
// router.delete('/users/:userId', userController.deleteUser); // Delete user
// router.get('/users/:userId/following', userController.getFollowing);
// router.get('/users/:userId/followers', userController.getFollowers);
// router.get('/users/:userId/feed', userController.getFeed);

// module.exports = router;

// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const authMiddleware = require('../middlewares/authMiddleware');

// Get user profile
router.get('/:userId', authMiddleware, userController.getUserProfile);

// Update user profile
router.put('/:userId', authMiddleware, userController.updateUserProfile);

// Delete user profile
router.delete('/:userId', authMiddleware, userController.deleteUserProfile);

// Route to follow a user
router.post('/:userId/follow', authMiddleware, userController.followUser);

// Route to unfollow a user
router.post('/:userId/unfollow', authMiddleware, userController.unfollowUser);

module.exports = router;

