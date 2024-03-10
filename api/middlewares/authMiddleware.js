const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwtToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    //     if(err){
    //         return res.status(401).json("Token is not valid!");
    //     }

    //     req.userId = data._id;
    //     // console.log(data);
    //     // console.log("passed!");
    //     next();
    // })
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        req.user = { userId: user._id };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
