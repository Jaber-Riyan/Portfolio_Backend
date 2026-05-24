import mongoose, { Schema } from 'mongoose';
import { IContactDocument } from './contact.interface';

const contactSchema = new Schema<IContactDocument>(
  {
    headline: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  { timestamps: true },
);

export const ContactModel = mongoose.model<IContactDocument>('Contact', contactSchema);
