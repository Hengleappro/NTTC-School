// server/api/auth/me.get.ts
import { defineEventHandler, getCookie, createError, deleteCookie } from 'h3';
import User from '~/server/models/User'; // Adjust path if your models folder is different

// --- IMPORTANT SECURITY NOTE ---
// The `decodeSessionId` function below is a SIMPLIFIED and INSECURE placeholder
// based on our previous basic sessionId: `session_${Date.now()}_${user._id}`.
// This format is predictable and NOT SUITABLE FOR PRODUCTION.
//
// For a real application, you MUST:
// 1. Use cryptographically secure random session IDs.
// 2. Store these session IDs on the server-side (e.g., in Redis or a dedicated
//    MongoDB 'sessions' collection) mapped to the user's ID. When this '/api/auth/me'
//    endpoint is called, you look up this random ID in your server-side store.
// OR
// 3. Use signed JWTs (JSON Web Tokens) stored in an HttpOnly cookie. This endpoint
//    would then verify the JWT's signature and extract user details from its payload.
//
// Using a dedicated auth library like Lucia Auth or Sidebase Nuxt Auth is highly
// recommended as they handle secure session management correctly.
// --- END IMPORTANT SECURITY NOTE ---

interface DecodedSession {
  userId: string;
  // You might include other session data here in a real system, like expiry.
}

// SIMPLIFIED AND INSECURE SESSION DECODING - FOR DEMO PURPOSES ONLY
async function decodeSessionId(sessionId: string): Promise<DecodedSession | null> {
  if (!sessionId || !sessionId.startsWith('session_')) {
    console.warn('Session ID missing or does not start with "session_".');
    return null;
  }

  const parts = sessionId.split('_');
  // Expecting format: session_timestamp_userId
  if (parts.length >= 3) {
    const userId = parts[parts.length - 1];
    // Basic check to see if it resembles a MongoDB ObjectId string
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      return { userId };
    } else {
      console.warn(`Extracted User ID "${userId}" does not look like a valid ObjectId.`);
    }
  }
  console.warn(`Invalid session ID format encountered: ${sessionId}. This decoding logic is for DEMO ONLY and is insecure.`);
  return null;
}

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'auth_session');

  if (!sessionId) {
    // No session cookie found, indicating the user is not authenticated.
    // It's conventional for a 'me' endpoint to return 401 if no valid session.
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No active session.',
    });
  }

  // --- REPLACE WITH SECURE SESSION VALIDATION LOGIC ---
  const decodedSession = await decodeSessionId(sessionId); // Using our insecure demo decoder

  if (!decodedSession || !decodedSession.userId) {
    // If session ID is invalid or userId could not be extracted:
    // 1. Clear the potentially corrupted/invalid cookie from the browser.
    deleteCookie(event, 'auth_session', { path: '/' });
    // 2. Respond with an unauthorized error.
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid session.',
    });
  }
  // --- END REPLACE ---

  try {
    // Fetch the user from the database using the userId from the decoded session.
    // Crucially, exclude the password field from the result.
    const user = await User.findById(decodedSession.userId).select('-password');

    if (!user) {
      // If a user with that ID doesn't exist (e.g., account deleted after session was created):
      // 1. Clear the now-invalid cookie.
      deleteCookie(event, 'auth_session', { path: '/' });
      // 2. Respond with an unauthorized error.
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: User not found for this session.',
      });
    }

    // If user is found and session is valid, return essential user information.
    // Avoid sending the entire Mongoose document directly unless necessary.
    // Tailor the response to what the frontend actually needs for its user state.
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      // Add any other fields your frontend needs to manage the user's state.
      // For example: profileImageUrl, preferences, etc.
    };

  } catch (error: any) {
    console.error('Error in /api/auth/me endpoint:', error);
    // For any other unexpected errors during database query or processing:
    // It's also a good idea to clear the cookie if something is seriously wrong.
    deleteCookie(event, 'auth_session', { path: '/' });
    throw createError({
      statusCode: 500, // Internal Server Error
      statusMessage: 'An unexpected error occurred while fetching user details.',
    });
  }
});