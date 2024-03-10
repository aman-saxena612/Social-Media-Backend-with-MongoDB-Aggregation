// const Post = require('../models/Post');
// const User = require('../models/User'); // For populating user data
// const jwt = require('jsonwebtoken'); // For authentication

// // ... other functions (middleware for JWT verification)

// exports.createPost = async (req, res) => {
//   try {
//     const { content } = req.body;

//     // Check for authorization header and verify JWT token
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret

//     const newPost = new Post({
//       content,
//       userId: decoded.id,
//     });

//     const savedPost = await newPost.save();
//     await User.findByIdAndUpdate(decoded.id, { $push: { posts: savedPost._id } }); // Update user's posts

//     res.status(201).json(savedPost);
//   } catch (err) {
//     console.error(err);
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     res.status(500).json({ message: 'Error creating post' });
//   }
// };

// exports.getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ timestamp: -1 }); // Sort by latest
//     res.json(posts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching posts' });
//   }
// };

// exports.getPost = async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const post = await Post.findById(postId).populate('userId'); // Populate user data

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.json(post);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching post' });
//   }
// };

// exports.updatePost = async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const { content } = req.body;

//     // Check for authorization header and verify JWT token
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     // Ensure authorized user is updating their own post
//     if (post.userId.toString() !== decoded.id) {
//       return res.status(401).json({ message: 'Unauthorized to update this post' });
//     }

//     const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true });
//     res.json(updatedPost);
//   } catch (err) {
//     console.error(err);
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     res.status(500).json({ message: 'Error updating post' });
//   }
// };

// exports.deletePost = async (req, res) => {
//     try {
//       const postId = req.params.postId;
  
//       // Check for authorization header and verify JWT token
//       const authHeader = req.headers.authorization;
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
  
//       const token = authHeader.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
  
//       const post = await Post.findById(postId);
  
//       if (!post) {
//         return res.status(404).json({ message: 'Post not found' });
//       }
  
//       // Ensure authorized user is deleting their own post
//       if (post.userId.toString() !== decoded.id) {
//         return res.status(401).json({ message: 'Unauthorized to delete this post' });
//       }
  
//       await Post.findByIdAndDelete(postId);
//       await User.findByIdAndUpdate(decoded.id, { $pull: { posts: postId } }); // Update user's posts
  
//       res.json({ message: 'Post deleted successfully' });
//     } catch (err) {
//       console.error(err);
//       if (err.name === 'JsonWebTokenError') {
//         return res.status(401).json({ message: 'Invalid token' });
//       }
//       res.status(500).json({ message: 'Error deleting post' });
//     }
//   };

// postController.js

const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    try {
        const { userId } = req.user;
        const { content } = req.body;
        const post = new Post({ content, userId });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { userId } = req.user;
        const post = await Post.findOneAndUpdate(
            { _id: req.params.postId, userId: userId },
            req.body,
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { userId } = req.user;
        const post = await Post.findOneAndDelete({ _id: req.params.postId, userId: userId });
        if (!post) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getLatestPosts = async (req, res) => {
    try {
        const { userId } = req.user;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the IDs of the users the current user is following
        const followedUsers = user.following;

        // Find the latest posts from followed users
        const followedPosts = await Post.aggregate([
            { $match: { userId: { $in: followedUsers } } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
        ]);

        // Find the user's own posts
        const userPosts = await Post.find({ userId });

        // Combine the followed posts and user's own posts
        const latestPosts = [...followedPosts, ...userPosts];

        // Sort the combined posts by createdAt in descending order
        latestPosts.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json(latestPosts);
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

