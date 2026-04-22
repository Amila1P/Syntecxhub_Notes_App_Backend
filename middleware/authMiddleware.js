const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the header
    const token = req.header('x-auth-token');

    // Don't allow without a token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add the user ID to the request object
        req.user = decoded.id;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;