const rateLimit = require("express-rate-limit");

const rateLimitMiddleware = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

module.exports = rateLimitMiddleware;
