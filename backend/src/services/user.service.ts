import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
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

  return user as UserData;
};

export const getUserById = async (id: string): Promise<UserData | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  
  return user as UserData | null;
}; 