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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followedUsers = user.following;

        const followedPosts = await Post.aggregate([
            { $match: { userId: { $in: followedUsers } } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 }
        ]);

        const userPosts = await Post.find({ userId });

        const latestPosts = [...followedPosts, ...userPosts];

        latestPosts.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json(latestPosts);
    } catch (error) {
        console.error('Error fetching latest posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

