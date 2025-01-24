import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { authenticateToken, authorizeRole } from '../middlewares/auth';
import passport from 'passport';
import { generateToken } from '../utils/jwtUtils';

const router = Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), loginUser);

// User registration
router.post('/register', registerUser);

// User login
// router.post('/login', loginUser);

router.post('/login', passport.authenticate('local', { session: false }), loginUser);

// Example of a protected route for admins
router.get('/admin', authenticateToken, authorizeRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

export default router;
