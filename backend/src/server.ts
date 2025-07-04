import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import app from './app';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Get port from environment variables or use default
const PORT = process.env.PORT || 8000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to database');

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};


app.get('/', (req, res) => {
  res.json({ message :'Server is running' , frontendUrl: process.env.FRONTEND_URL},
  );
});

// Handle server shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
  process.exit(0);
});

// Start the server
startServer();

 