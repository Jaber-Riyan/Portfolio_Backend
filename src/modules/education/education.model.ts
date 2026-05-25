import mongoose, { Schema } from 'mongoose';
import { IEducationDocument } from './education.interface';

const educationSchema = new Schema<IEducationDocument>(
  {
    degree: { type: String, required: true, trim: true },
    school: { type: String, required: true, trim: true },
    period: { type: String, required: true },
    summary: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

educationSchema.index({ sortOrder: 1 });
educationSchema.index({ degree: 1, school: 1 }, { unique: true });

export const EducationModel = mongoose.model<IEducationDocument>('Education', educationSchema);
