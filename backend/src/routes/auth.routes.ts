import { Router } from 'express';
import passport from 'passport';
import { googleCallback, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  googleCallback
);

// Get current user (protected route)
router.get('/me', authenticate, getCurrentUser);

// Logout route
router.post('/logout', logout);

export default router; 