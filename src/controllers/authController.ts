// src/controllers/authController.ts
import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import {User} from '../database/models/User';  // Assuming User model is already set up
import { generateToken } from '../utils/jwtUtils';  // Function to generate JWT
import log from "../utils/logger";

const saltRounds = 10;

// Register user
export const registerUser : RequestHandler = async (req: Request, res: Response) => {
    try {
      const { username, email, password, role = 'user' } = req.body;
  
      if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required: username, email, and password' });
        return;
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create the user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });
  
      // Generate JWT token
      const token = generateToken(newUser.id, newUser.email, newUser.role);
  
      // Send response with the token
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      log.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Login user
export const loginUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'All fields are required: username, email, and password' });
        return;
      }
  
      // Check if the user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }
  
      // Generate JWT token
      const token = generateToken(user.id, user.email, user.role);
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      log.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
