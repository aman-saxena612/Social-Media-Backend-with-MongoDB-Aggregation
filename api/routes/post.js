// // src/routes/postRoutes.js
// const express = require("express");
// const router = express.Router();
// const postController = require("../controller/post");

// router.post("/", postController.createPost);
// router.put("/:id", postController.updatePost);
// router.delete("/:id", postController.deletePost);
// // router.put("/:id/like", postController.likeDislikePost);
// router.get("/:id", postController.getPost);
// // router.get("/timeline/all", postController.getTimelinePosts);

// module.exports = router;

// postRoutes.js

const express = require('express');
const router = express.Router();
const postController = require('../controller/post');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new post
router.post('/', authMiddleware, postController.createPost);

// Update a post
router.put('/:postId', authMiddleware, postController.updatePost);

// Delete a post
router.delete('/:postId', authMiddleware, postController.deletePost);

// Get latest posts from followed users
router.get('/latest', authMiddleware, postController.getLatestPosts);

module.exports = router;
