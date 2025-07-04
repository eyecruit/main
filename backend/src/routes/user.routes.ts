import { Router } from 'express';
import { getUserProfile } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Get user by ID (protected route)
router.get('/:id', authenticate, getUserProfile);

export default router; 