"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticateToken = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
// Middleware to check if JWT token is valid and attached to the request
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extract token from Bearer header
    if (!token) {
        res.status(401).json({ message: 'Access denied, token missing' });
        return;
    }
    try {
        const decoded = (0, jwtUtils_1.verifyToken)(token); // Verify the token
        console.log(JSON.stringify(decoded));
        console.log(typeof decoded);
        req.user = decoded; // Attach the decoded token to the request
        next(); // Proceed to the next middleware or route
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware to check the user's role
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const role = req.user.role;
        if (!roles.includes(role)) {
            res.status(403).json({ message: 'Access denied, insufficient privileges' });
            return;
        }
        next(); // Proceed if the user has the correct role
    };
};
exports.authorizeRole = authorizeRole;
