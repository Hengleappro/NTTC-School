// server/plugins/mongodb.ts
import mongoose from 'mongoose';
import { useRuntimeConfig } from '#imports'; // Ensure useRuntimeConfig is imported correctly

let isConnected = false; // To prevent multiple connections in dev mode

export default defineNitroPlugin(async (nitroApp) => {
  // Only connect if not already connected (important for hot reloading in dev)
  if (isConnected) {
    console.log('MongoDB: Already connected, skipping new connection attempt.');
    return;
  }

  const config = useRuntimeConfig();
  const uri = config.mongodbUri;
  const dbName = config.mongodbDbName;

  if (!uri) {
    console.error('MongoDB: MONGODB_URI environment variable is not defined in runtime config!');
    // Throwing an error here will prevent the server from starting, which is good for critical config issues.
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (!dbName) {
    console.warn('MongoDB: MONGODB_DB_NAME environment variable is not defined. Using default database or the one in the URI.');
  }

  try {
    await mongoose.connect(uri, {
      dbName: dbName || undefined, // Use dbName if provided, otherwise let Mongoose infer from URI
      // Other options you might need:
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
    });
    isConnected = true;
    console.log('MongoDB: Connected to Atlas successfully!');

    // Optional: Log connection events for detailed debugging
    mongoose.connection.on('connected', () => {
      console.log('Mongoose: Default connection open.');
    });
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose: Default connection error: ' + err);
      isConnected = false; // Reset connection status on error
    });
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose: Default connection disconnected.');
      isConnected = false; // Reset connection status on disconnect
    });
    // Add graceful shutdown handling
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB: Connection disconnected through app termination.');
      process.exit(0);
    });

  } catch (e: any) {
    isConnected = false; // Ensure connection status is false on failure
    console.error('MongoDB: Connection error:', e);
    // Important: Re-throw the error to ensure the server doesn't start if DB connection fails
    throw new Error(`Failed to connect to MongoDB: ${e.message}`);
  }
});