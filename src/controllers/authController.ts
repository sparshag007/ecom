import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import {User} from '../database/models/User';
import { generateToken } from '../utils/jwtUtils';
import log from "../utils/logger";
import { RequestUser } from '../types/requestuser';

const saltRounds = 10;

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
  
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        googleId: null
      });
  
      const token = generateToken(newUser.id, newUser.email, newUser.role);
  
      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      log.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = req.user as RequestUser;
    if (!user) {
      res.status(400).json({ message: 'User not authenticated.' });
      return;
    }

    const token = generateToken(user.id, user.email, user.role);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

