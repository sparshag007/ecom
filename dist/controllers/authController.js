"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../database/models/User"); // Assuming User model is already set up
const jwtUtils_1 = require("../utils/jwtUtils"); // Function to generate JWT
const saltRounds = 10;
// Register user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role = 'user' } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: 'All fields are required: username, email, and password' });
            return;
        }
        const existingUser = yield User_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Create the user
        const newUser = yield User_1.User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });
        // Generate JWT token
        const token = (0, jwtUtils_1.generateToken)(newUser.id, newUser.email, newUser.role);
        // Send response with the token
        res.status(201).json({ message: 'User registered successfully', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'All fields are required: username, email, and password' });
            return;
        }
        // Check if the user exists
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        // Compare passwords
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        // Generate JWT token
        const token = (0, jwtUtils_1.generateToken)(user.id, user.email, user.role);
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginUser = loginUser;
