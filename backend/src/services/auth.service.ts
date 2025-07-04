import { findOrCreateUser, UserData } from './user.service';
import { signToken } from '../utils/jwt';

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

export const handleGoogleAuth = async (profile: GoogleProfile): Promise<{
  user: UserData;
  token: string;
}> => {
  // Extract user info from Google profile
  const email = profile.emails[0]?.value;
  if (!email) {
    throw new Error('Email not provided by Google');
  }

  const name = profile.displayName;
  const image = profile.photos?.[0]?.value;

  // Find or create user
  const user = await findOrCreateUser(email, name, image);

  // Generate JWT
  const token = signToken(user);

  return { user, token };
}; 