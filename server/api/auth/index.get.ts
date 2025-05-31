import { defineEventHandler } from 'h3';
import { connectDB } from '~/server/utils/mongoose'; // Your connectDB utility
import User from '~/server/models/User'; // Your User model
import { requireAdmin } from '~/server/utils/session'; // Your session utility

export default defineEventHandler(async (event) => {
  await connectDB();
  await requireAdmin(event); // Ensure only admin can access

  try {
    const usersFromDb = await User.find({}).select('-password').sort({ createdAt: -1 }); // Exclude password, sort by newest

    // Map _id to id for frontend consistency
    const users = usersFromDb.map(user => {
      const { _id, ...rest } = user.toObject(); // Use .toObject() for plain JS object
      return { id: _id.toString(), ...rest };
    });

    return users;
  } catch (error: any) {
    console.error('API Error (GET /api/users):', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch users.',
    });
  }
});