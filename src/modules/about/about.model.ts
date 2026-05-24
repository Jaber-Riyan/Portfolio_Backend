import mongoose, { Schema } from 'mongoose';
import { IAboutDocument } from './about.interface';

const aboutSchema = new Schema<IAboutDocument>(
  {
    intro: { type: String, required: true },
    journey: { type: String, required: true },
    work: { type: String, required: true },
    hobbies: { type: String, required: true },
    belief: { type: String, required: true },
  },
  { timestamps: true },
);

export const AboutModel = mongoose.model<IAboutDocument>('About', aboutSchema);
