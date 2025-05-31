// server/utils/mongoose.ts
import mongoose from 'mongoose';
import { useRuntimeConfig } from '#imports';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  const config = useRuntimeConfig();
  const uri = config.mongodbUri; // Ensure this is correctly retrieved

  if (!uri) {
    console.error('MongoDB URI is not defined in runtime config!');
    throw new Error('MongoDB URI is not defined.');
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('MongoDB Connected!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false; // Important: reset if connection fails
    throw error; // Re-throw to propagate the error
  }
};

// Optional: Listen for connection events (useful for debugging)
mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ' + mongoose.connection.host);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose default connection error: ' + err);
  isConnected = false; // Ensure state is updated on error
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
  isConnected = false; // Ensure state is updated on disconnect
});