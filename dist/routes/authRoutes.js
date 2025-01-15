"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// User registration
router.post('/register', authController_1.registerUser);
// User login
router.post('/login', authController_1.loginUser);
// Example of a protected route for admins
router.get('/admin', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome Admin!' });
});
exports.default = router;
