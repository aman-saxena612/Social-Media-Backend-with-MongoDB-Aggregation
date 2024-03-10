const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.followUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUserId = req.user.userId;

        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ error: 'User to follow not found' });
        }

        if (userToFollow.followers.includes(loggedInUserId)) {
            return res.status(400).json({ error: 'User is already being followed' });
        }

        userToFollow.followers.push(loggedInUserId);
        await userToFollow.save({ validateModifiedOnly: true });

        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser.following.includes(userId)) {
            loggedInUser.following.push(userId);
            await loggedInUser.save();
        }

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error while following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUserId = req.user.userId;

        const userToUnfollow = await User.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User to unfollow not found' });
        }

        if (!userToUnfollow.followers.includes(loggedInUserId)) {
            return res.status(400).json({ error: 'User is not being followed' });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== loggedInUserId);
        await userToUnfollow.save({ validateModifiedOnly: true });

        const loggedInUser = await User.findById(loggedInUserId);
        loggedInUser.following = loggedInUser.following.filter(followingId => followingId.toString() !== userId);
        await loggedInUser.save();

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error while unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


