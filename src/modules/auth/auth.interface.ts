import { Document, Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'admin';
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}
