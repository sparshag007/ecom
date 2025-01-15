"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
// src/utils/jwtUtils.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = 'your_secret_key'; // In production, use an environment variable
// Function to generate JWT token
const generateToken = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, secretKey, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
// Function to verify JWT token
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyToken = verifyToken;
