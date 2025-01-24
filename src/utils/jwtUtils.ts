import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'yoursecret'; // In production, use an environment variable

// Function to generate JWT token
export const generateToken = (id: number, email: string, role: string) => {
  return jwt.sign({ id, email, role }, secretKey, { expiresIn: '1h' });
};

// Function to verify JWT token
export const verifyToken = (token: string) => {
  return jwt.verify(token, secretKey);
};
