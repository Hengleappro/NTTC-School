// server/api/auth/profile.ts
import { defineEventHandler, readBody, H3Error } from 'h3';
import User from '~/server/models/User'; // Assuming your Mongoose User model is here
import { connectDB } from '~/server/utils/mongoose'; 

// FIX: Import getUserFromSession from your session utility
import { getUserFromSession } from '~/server/utils/session'; // <--- THIS IS THE CORRECT IMPORT!

// You likely don't need requireAdmin in profile.ts unless only admins can update ANY profile.
// If it's for a user updating THEIR OWN profile, just check if `session.user.id` matches the user being updated.
// For now, I'll keep the import for requireAdmin as you had it, but remember its purpose.
// import { requireAdmin } from '~/server/utils/session'; 


export default defineEventHandler(async (event) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

    try {
        console.log('Profile update endpoint hit.'); // Debug log 1

        // Use getUserFromSession to get the authenticated user
        const userSession = await getUserFromSession(event); // <--- CALL THIS FUNCTION
        console.log('Session retrieved:', userSession ? 'Yes' : 'No', 'User ID:', userSession?._id); // Debug log 2 (use _id for Mongoose object)

        // Check if a user is authenticated in the session
        if (!userSession || !userSession._id) { // Use userSession._id for Mongoose object ID
            throw new H3Error('Unauthorized. Please log in.')
                .setStatusCode(401);
        }

        const body = await readBody(event);
        const userId = userSession._id; // Use _id from the authenticated user object
        console.log('Request body:', body); // Debug log 3
        console.log('User ID from session:', userId); // Debug log 4

        // Connect to DB if not handled globally (e.g., in a plugin)
        await connectDB(); 

        if (!body.name || !body.email) {
            throw new H3Error('Name and Email are required.')
                .setStatusCode(400);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            throw new H3Error('Invalid email format.')
                .setStatusCode(400);
        }

        const userToUpdate = await User.findById(userId);
        console.log('User found in DB for update:', userToUpdate ? 'Yes' : 'No'); // Debug log 5

        if (!userToUpdate) {
            throw new H3Error('User not found.')
                .setStatusCode(404);
        }

        if (body.email !== userToUpdate.email) {
            const existingUserWithEmail = await User.findOne({ email: body.email });
            if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
                throw new H3Error('Email already in use by another account.')
                    .setStatusCode(409);
            }
        }
        
        userToUpdate.name = body.name;
        userToUpdate.email = body.email;
        userToUpdate.bio = body.bio || '';
        userToUpdate.avatar = body.avatar || userToUpdate.avatar; 
        console.log('User object before saving:', userToUpdate); // Debug log 6

        await userToUpdate.save();
        console.log('User saved successfully to DB.'); // Debug log 7

        const updatedUser = {
            id: userToUpdate._id.toString(),
            name: userToUpdate.name,
            email: userToUpdate.email,
            bio: userToUpdate.bio,
            avatar: userToUpdate.avatar,
            role: userToUpdate.role,
            createdAt: userToUpdate.createdAt,
            updatedAt: userToUpdate.updatedAt,
        };

        console.log('Profile updated successfully for user:', updatedUser.id);
        return updatedUser;

    } catch (error: any) {
        console.error('Profile update error (caught):', error); 
        if (error instanceof H3Error) {
            event.node.res.statusCode = error.statusCode;
            return { message: error.message, data: error.data };
        }
        event.node.res.statusCode = 500;
        return { message: 'An unexpected error occurred during profile update.' };
    }
});