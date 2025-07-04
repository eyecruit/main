import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Pass the profile to the callback
      return done(null, profile);
    }
  )
);

export default passport; 