
export default defineEventHandler(async (event) => {
  await connectDB();
  const requestingAdmin = await requireAdmin(event);

  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found or already deleted.' });
    }

    return { message: 'User deleted successfully', id: userId };
  } catch (error: any) {
    console.error(`API Error (DELETE /api/users/${userId}):`, error);
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete user.',
    });
  }
});