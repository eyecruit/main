import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_AVATAR = '/avatar/image.png'; // Default avatar path

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  image: string | null;
}

export const findOrCreateUser = async (
  email: string,
  name?: string,
  image?: string
): Promise<UserData> => {
  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // If user doesn't exist, create a new one
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        image: image || null,
      },
    });
  }

  return user;
};

export const getUserById = async (id: string): Promise<UserData | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  
  return user;
};

// Create a new user with email and password
export const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<UserData> => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Create the user with the correct type casting
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      image: DEFAULT_AVATAR, // Set default avatar
    } as any, // Use type assertion to bypass TypeScript check
  });
  
  return user;
};

// Find user by email (for login)
export const findUserByEmail = async (email: string): Promise<UserWithPassword | null> => {
  // Use type assertion to handle the password field
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      image: true,
    } as any, // Use type assertion to bypass TypeScript check
  });
  
  // Return null if no user found
  if (!user) return null;
  
  // Convert to the expected type
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: user.password,
    image: user.image
  };
};

// Verify password
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string | null
): Promise<boolean> => {
  if (!hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
}; 