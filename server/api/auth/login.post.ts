// server/api/auth/login.post.ts
import { defineEventHandler, readBody, createError, setCookie } from 'h3';
import User, { IUser } from '~/server/models/User'; // Adjust path if needed
// For generating a more secure session ID if you're not using an auth library yet
// import { randomBytes } from 'crypto';

export default defineEventHandler(async (event) => {
  // We assume the MongoDB connection is handled by a plugin.

  const body = await readBody(event);
  const { email, password } = body;

  // --- Basic Input Validation ---
  if (!email || !password) {
    throw createError({
      statusCode: 400, // Bad Request
      statusMessage: 'Missing email or password.',
    });
  }

  try {
    // --- Find User by Email ---
    // IMPORTANT: We need to explicitly select the password field as it's `select: false` in the schema.
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw createError({
        statusCode: 401, // Unauthorized
        statusMessage: 'Invalid email or password.', // Generic message for security
      });
    }

    // --- Compare Passwords ---
    // The user instance has the 'comparePassword' method we defined in the schema
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw createError({
        statusCode: 401, // Unauthorized
        statusMessage: 'Invalid email or password.', // Generic message
      });
    }

    // --- Password Matched: Handle Session/Token ---
    // This is a crucial part. For a real application, you'd typically:
    // 1. Generate a secure session token (e.g., using JWT or a random string).
    // 2. Store session information on the server-side (e.g., in Redis, or a sessions collection in MongoDB)
    //    or create a stateless JWT.
    // 3. Set an HttpOnly, Secure cookie containing the session ID or JWT.

    // For demonstration, let's create a simple session identifier and set a cookie.
    // REPLACE THIS WITH A ROBUST SESSION MANAGEMENT STRATEGY (e.g., using Lucia Auth, Sidebase Nuxt Auth, or JWTs)
    const sessionId = `session_${Date.now()}_${user._id}`; // Example: Very basic session ID

    // Set an HttpOnly cookie to store the session ID.
    // In production, also set 'secure: true' (requires HTTPS) and 'sameSite: 'lax'' or 'strict'.
    setCookie(event, 'auth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'lax', // Or 'strict'
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // Example: 7 days
      // domain: 'yourdomain.com' // Optional: specify your domain in production
    });

    // --- Prepare Response (User Data without Password) ---
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      createdAt: user.createdAt,
    };

    return {
      message: 'Login successful!',
      user: userResponse,
      // In a real app, you might not send the user object directly here
      // but rather rely on a separate `/api/auth/me` endpoint to fetch user data using the session.
    };

  } catch (error: any) {
    if (error.statusCode) { // If it's an error we created with createError
      throw error;
    }
    console.error('Login Error:', error);
    throw createError({
      statusCode: 500, // Internal Server Error
      statusMessage: 'An unexpected error occurred during login.',
    });
  }
});