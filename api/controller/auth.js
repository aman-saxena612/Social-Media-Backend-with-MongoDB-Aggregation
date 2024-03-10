const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const User = require('../models/User');

const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res) => {
    try {
        const { username, email, password, bio, profilePicture } = req.body;
        // console.log('Request body:', req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
            bio: bio,
            profilePicture: profilePicture
        });
        await user.save();
        res.status(201).json({user, message: 'User registered successfully' });
    } catch (error) {
        // console.error('Error during registration:', error); 
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const maxAgeInMilliseconds = 1 * 24 * 60 * 60 * 1000;
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // console.log("password error");
            return res.status(401).json({ error: 'Invalid password or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.cookie('jwtToken', token, { httpOnly: true, maxAge: maxAgeInMilliseconds });
        // console.log("error here!");
        
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
