// server/api/auth/logout.post.ts
import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  // Clear the session cookie.
  // The name 'auth_session' must match the name used when setting the cookie during login.
  deleteCookie(event, 'auth_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Match settings from login
    sameSite: 'lax',                             // Match settings from login
    path: '/',                                   // Match settings from login
    // domain: 'yourdomain.com' // Optional: specify your domain if used during login
  });

  // In a more complete session management system, you would also:
  // 1. Invalidate the session on the server-side if you are storing sessions in a database (e.g., Redis, MongoDB).
  //    This would involve finding the session by its ID (from the cookie, before deleting it) and removing it
  //    or marking it as invalid.

  event.node.res.statusCode = 200; // OK
  return {
    message: 'Logout successful!',
  };
});