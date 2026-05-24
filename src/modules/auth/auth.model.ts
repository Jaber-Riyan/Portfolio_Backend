import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from './auth.interface';

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
