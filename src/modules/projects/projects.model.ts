import mongoose, { Schema } from 'mongoose';
import { IProjectDocument } from './projects.interface';

const githubLinkSchema = new Schema(
  { label: { type: String, required: true }, url: { type: String, required: true } },
  { _id: false },
);

const projectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    image: {
      url: { type: String, default: '' },
      key: { type: String, default: '' },
    },
    techStack: { type: [String], default: [] },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    githubLinks: { type: [githubLinkSchema], default: [] },
    live: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.index({ sortOrder: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ title: 'text' });
projectSchema.index({ title: 1 }, { unique: true });

export const ProjectModel = mongoose.model<IProjectDocument>('Project', projectSchema);
