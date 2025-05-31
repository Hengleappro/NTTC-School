// File: server/models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface defining the User document structure (properties)
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because it's not always selected/returned
  role: 'user' | 'admin';
  bio?: string;
  avatar?: string; // Optional avatar field
  createdAt: Date;
  updatedAt: Date;
  // Instance method to compare passwords (optional, can be useful)
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Mongoose Schema for User
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true, // Ensure emails are unique
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false, // By default, do not return password field when querying
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      trim: true,
      default: '', // Default to empty string if no avatar is set
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook to hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare candidate password with the user's hashed password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false; // Should not happen if password is required and selected
  return bcrypt.compare(candidatePassword, this.password);
};


// Create and export the User model
// Check if the model already exists to prevent OverwriteModelError in HMR environments
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
