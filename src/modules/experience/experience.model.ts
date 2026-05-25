import mongoose, { Schema } from 'mongoose';
import { IExperienceDocument } from './experience.interface';

const experienceSchema = new Schema<IExperienceDocument>(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, default: '' },
    period: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    impact: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

experienceSchema.index({ sortOrder: 1 });
experienceSchema.index({ role: 1, company: 1 }, { unique: true });

export const ExperienceModel = mongoose.model<IExperienceDocument>('Experience', experienceSchema);
