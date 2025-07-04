const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.emails[0].value }
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new user if doesn't exist
        const newUser = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            name: profile.displayName,
            image: profile.photos[0].value
          }
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
); 