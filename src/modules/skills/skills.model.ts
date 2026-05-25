import mongoose, { Schema } from 'mongoose';
import { ISkillCategoryDocument } from './skills.interface';

const skillItemSchema = new Schema(
  { name: { type: String, required: true }, icon: { type: String, required: true } },
  { _id: false },
);

const skillCategorySchema = new Schema<ISkillCategoryDocument>(
  {
    title: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
    items: { type: [skillItemSchema], default: [] },
  },
  { timestamps: true },
);

skillCategorySchema.index({ sortOrder: 1 });
skillCategorySchema.index({ title: 1 }, { unique: true });

export const SkillCategoryModel = mongoose.model<ISkillCategoryDocument>('SkillCategory', skillCategorySchema);
