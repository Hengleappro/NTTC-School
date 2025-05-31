import { defineEventHandler, readBody, createError } from 'h3';
import { connectDB } from '~/server/utils/mongoose'; // Your DB connection utility
import User from '~/server/models/User';
// connectDB, User, requireAdmin already imported conceptually or ensure they are if in separate contexts

export default defineEventHandler(async (event) => {
  await connectDB();
  const requestingAdmin = await requireAdmin(event); // Ensure admin is performing action
  
  const body = await readBody(event);

  const { name, email, password, role, bio } = body;

  if (!name || !email || !password || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: name, email, password, role.',
    });
  }
  if (password.length < 6) {
     throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters.',
    });
  }


  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'User with this email already exists.',
      });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // Password will be hashed by the pre-save hook
      role,
      bio: bio || '',
    });

    await newUser.save();
    
    // Return the created user (excluding password, map _id to id)
    const { _id, password: savedPassword, ...userResponseData } = newUser.toObject();
    return {
      user: {
        id: _id.toString(),
        ...userResponseData,
      },
    };
  } catch (error: any) {
    console.error('API Error (POST /api/users):', error);
    if (error.statusCode) throw error; // Re-throw errors we created
     // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      let messages = Object.values(error.errors).map((val: any) => val.message);
      throw createError({ statusCode: 400, statusMessage: messages.join(' ') });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create user.',
    });
  }
});