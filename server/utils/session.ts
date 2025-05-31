// server/utils/session.ts
import { getCookie, createError, H3Event, deleteCookie } from 'h3'; // Added deleteCookie to imports
import User, { IUser } from '~/server/models/User';

// -----------------------------------------------------------------------------
// WARNING: INSECURE SESSION MECHANISM
// The current session ID generation (in login.post.ts) and parsing below
// is for DEMONSTRATION PURPOSES ONLY and is NOT SECURE.
// - Session IDs are predictable/guessable.
// - No protection against replay attacks or session hijacking.
// - No proper session lifecycle management (e.g., server-side invalidation).
//
// For any real application, please replace this with a robust and secure
// session management strategy. Consider libraries like:
// - Lucia Auth (lucia-auth.com) - Recommended for modern auth in JS/TS
// - Nuxt-Auth (Sidebase) or other community modules for Nuxt 3
// - Implementing secure JWTs (JSON Web Tokens) with HttpOnly, Secure cookies
// -----------------------------------------------------------------------------

async function getUserIdFromSessionCookie(event: H3Event): Promise<string | null> {
  const sessionId = getCookie(event, 'auth_session');

  // console.log('[Session] Raw auth_session cookie:', sessionId); // Optional: for deep debugging

  if (!sessionId || !sessionId.startsWith('session_')) {
    // console.log('[Session] No session cookie found or prefix mismatch.'); // Optional
    return null;
  }

  const parts = sessionId.split('_');
  if (parts.length >= 3) { // Expects "session", a timestamp (or similar), and then the userId
    const userId = parts[parts.length - 1]; // Assumes user ID is the last part
    if (userId.match(/^[0-9a-fA-F]{24}$/)) { // Basic check for MongoDB ObjectId format
      // console.log('[Session] Successfully parsed userId:', userId); // Optional
      return userId;
    } else {
      console.warn(`[Session] Parsed potential userId "${userId}" does not match ObjectId format from cookie: ${sessionId}`);
    }
  } else {
    console.warn(`[Session] Invalid session ID format - not enough parts after splitting: ${sessionId}`);
  }
  
  return null;
}

export async function getUserFromSession(event: H3Event): Promise<IUser | null> {
  const userId = await getUserIdFromSessionCookie(event);

  if (!userId) {
    // console.log('[Session] No userId obtained from session cookie.'); // Optional
    return null;
  }

  try {
    // console.log(`[Session] Attempting to find user by ID: ${userId}`); // Optional
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      console.warn(`[Session] User not found in DB for ID: ${userId}. Clearing potentially stale cookie.`);
      // Clear the potentially stale/invalid cookie
      deleteCookie(event, 'auth_session', {
        path: '/',
        // Add other cookie options like domain, secure, httpOnly, sameSite if they were used when setting
      });
      return null;
    }
    // console.log(`[Session] User found: ${user.email}, Role: ${user.role}`); // Optional
    return user;
  } catch (dbError) {
    console.error(`[Session] Database error fetching user by ID ${userId}:`, dbError);
    return null; // Don't throw, let authorization checks handle it
  }
}

export async function requireUser(event: H3Event): Promise<IUser> {
  const user = await getUserFromSession(event);
  if (!user) {
    console.log('[Session] requireUser: No user found from session. Throwing 401.');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Authentication required' });
  }
  return user;
}

export async function requireAdmin(event: H3Event): Promise<IUser> {
  const user = await requireUser(event); // This will throw 401 if no user

  // --- Detailed logging for admin check ---
  console.log(`[Session] requireAdmin: Checking admin access for user ID: ${user._id}, Email: ${user.email}, Role from DB: "${user.role}"`);

  if (user.role !== 'admin') { // Ensure 'admin' is lowercase and matches DB
    console.warn(`[Session] requireAdmin: Access denied. User role "${user.role}" is not "admin".`);
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admin access required' });
  }

  console.log(`[Session] requireAdmin: Access granted for admin user: ${user.email}`);
  return user;
}