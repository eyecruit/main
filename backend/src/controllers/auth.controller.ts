import { Request, Response } from 'express';
import { handleGoogleAuth, GoogleProfile } from '../services/auth.service';
import ms from 'ms'; // ✅ compatible with all tsconfig settings
import dotenv from 'dotenv';
dotenv.config();

// Handle Google OAuth callback
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user profile from Passport
    const profile = req.user as unknown as GoogleProfile;
    
    if (!profile) {
      res.status(400).json({ message: 'Google authentication failed: No profile received' });
      return;
    }

    // Process the Google profile
    const { user, token } = await handleGoogleAuth(profile);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms('7d'), // convert "7d" to milliseconds
    });
    

    // Redirect to frontend dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

// Get current user
export const getCurrentUser = (req: Request, res: Response): void => {
  // User is attached to request by auth middleware
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // Return user data (excluding sensitive info if any)
  res.status(200).json({
    id: req.userData?.id,
    name: req.userData?.name,
    email: req.userData?.email,
    image: req.userData?.image,
  });
};

// Logout user
export const logout = (req: Request, res: Response): void => {
  // Clear the token cookie
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}; 