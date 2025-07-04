import { Request, Response } from 'express';
import { getUserById } from '../services/user.service';

// Get user by ID
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Return user data (excluding sensitive info if any)
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 