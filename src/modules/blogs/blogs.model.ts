import mongoose, { Schema } from 'mongoose';
import { IBlogDocument } from './blogs.interface';

const blogSchema = new Schema<IBlogDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    body: { type: String, required: true },
    image: {
      url: { type: String, default: '' },
      key: { type: String, default: '' },
    },
    tags: { type: [String], default: [] },
    link: { type: String, default: '' },
    readTime: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ published: 1 });
blogSchema.index({ title: 'text', excerpt: 'text' });

export const BlogModel = mongoose.model<IBlogDocument>('Blog', blogSchema);
