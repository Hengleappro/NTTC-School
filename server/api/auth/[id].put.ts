import User from '~/server/models/User';
export default defineEventHandler(async (event) => {
  await connectDB();
  const requestingAdmin = await requireAdmin(event);

  const userId = event.context.params?.id;
  const body = await readBody(event);

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
  }
  if (Object.keys(body).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Request body cannot be empty for update.' });
  }


  try {
    const userToUpdate = await User.findById(userId).select('+password'); // Select password for potential update
    if (!userToUpdate) {
      throw createError({ statusCode: 404, statusMessage: 'User not found.' });
    }

    // Update fields
    if (body.name) userToUpdate.name = body.name;
    if (body.email) {
        const emailLower = body.email.toLowerCase();
        if (emailLower !== userToUpdate.email) { // Check if email is being changed
            const existingUser = await User.findOne({ email: emailLower });
            if (existingUser && existingUser._id.toString() !== userId) {
                throw createError({ statusCode: 409, statusMessage: 'This email is already in use.' });
            }
            userToUpdate.email = emailLower;
        }
    }
    if (body.role) userToUpdate.role = body.role;
    if (typeof body.bio !== 'undefined') userToUpdate.bio = body.bio;
    
    // If password is provided and is different, update it.
    // The pre-save hook will hash it.
    if (body.password) {
        if (body.password.length < 6) {
            throw createError({ statusCode: 400, statusMessage: 'New password must be at least 6 characters.' });
        }
        userToUpdate.password = body.password; // Mark as modified for pre-save hook
    }

    await userToUpdate.save();

    const { _id, password: savedPassword, ...userResponseData } = userToUpdate.toObject();
    return {
      user: {
        id: _id.toString(),
        ...userResponseData,
      },
    };
  } catch (error: any) {
    console.error(`API Error (PUT /api/users/${userId}):`, error);
    if (error.statusCode) throw error;
    if (error.name === 'ValidationError') {
      let messages = Object.values(error.errors).map((val: any) => val.message);
      throw createError({ statusCode: 400, statusMessage: messages.join(' ') });
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update user.',
    });
  }
});