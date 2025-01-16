import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middlewares/auth';

const router = Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Example of a protected route for admins
router.get('/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

export default router;
