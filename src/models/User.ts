import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
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
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, {
  timestamps: true,
});

UserSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', UserSchema);
