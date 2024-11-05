const jwt = require('jsonwebtoken');

// Middleware to authenticate token from cookies
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Get the token from the cookies

    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token data to req.user
        next();
    } catch (error) {
        console.error("Token authentication error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Middleware to authorize roles
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Check if user's role is in the allowedRoles array
        if (allowedRoles.includes(req.user.role)) {
            next(); // Access granted
        } else {
            return res.status(403).json({ message: "Access denied, insufficient permissions" });
        }
    };
};

module.exports = { authenticateToken, authorizeRole };
