// server/api/auth/register.post.ts
import { defineEventHandler, readBody, createError } from 'h3';
import User, { IUser } from '~/server/models/User'; // Adjust path if your models folder is different

export default defineEventHandler(async (event) => {
  // Ensure the database connection is established.
  // This might be handled by a server plugin (e.g., server/plugins/mongodb.ts)
  // If not, you might need to explicitly call your connectDB() utility here.
  // For now, we assume the plugin handles the connection.

  const body = await readBody(event);

  const { name, email, password, role, bio } = body; // Role and bio are optional for basic registration

  // --- Basic Input Validation ---
  if (!name || !email || !password) {
    throw createError({
      statusCode: 400, // Bad Request
      statusMessage: 'Missing required fields: name, email, or password.',
    });
  }

  // Validate email format (simple regex, consider a more robust library for production)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format.',
    });
  }

  // Validate password length (example)
  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters long.',
    });
  }

  try {
    // --- Check if user already exists ---
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw createError({
        statusCode: 409, // Conflict
        statusMessage: 'User with this email already exists.',
      });
    }

    // --- Create new user ---
    // The password will be hashed by the pre-save middleware in User.ts
    const newUser = new User({
      name,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      password,
      role: role || 'user', // Default to 'user' if no role is provided
      bio: bio || '',
    });

    await newUser.save();

    // --- Prepare response (don't send back the password) ---
    // Mongoose's toObject() or toJSON() with schema transforms can also handle this
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      bio: newUser.bio,
      createdAt: newUser.createdAt,
    };

    // Set status code for successful creation
    event.node.res.statusCode = 201; // Created
    return {
      message: 'User registered successfully!',
      user: userResponse,
    };

  } catch (error: any) {
    // Handle Mongoose validation errors or other errors
    if (error.statusCode) { // If it's an error we created with createError
      throw error;
    }
    // Log the actual error for debugging on the server
    console.error('Registration Error:', error);

    // For Mongoose validation errors, you might want to be more specific
    if (error.name === 'ValidationError') {
        // Extract specific validation messages if desired
        const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
        throw createError({
            statusCode: 400,
            statusMessage: `Validation failed: ${messages}` || 'User registration failed due to validation errors.',
        });
    }

    throw createError({
      statusCode: 500, // Internal Server Error
      statusMessage: 'An unexpected error occurred during registration.',
    });
  }
});