import mongoose, { Schema } from 'mongoose';
import { IThemeDocument } from './theme.interface';
import { SECTION_NAMES } from '../../shared/constants';

const sectionThemeSchema = new Schema(
  {
    bg: { type: String, default: '#0f172a' },
    text: { type: String, default: '#f1f5f9' },
    accent: { type: String, default: '#6366f1' },
    bgImage: { type: String, default: '' },
  },
  { _id: false },
);

const sectionsShape: Record<string, typeof sectionThemeSchema> = {};
SECTION_NAMES.forEach((name) => { sectionsShape[name] = sectionThemeSchema; });

const themeSchema = new Schema<IThemeDocument>(
  {
    global: {
      primary: { type: String, default: '#6366f1' },
      secondary: { type: String, default: '#8b5cf6' },
      background: { type: String, default: '#0f172a' },
      text: { type: String, default: '#f1f5f9' },
      muted: { type: String, default: '#64748b' },
      panel: { type: String, default: '#1e293b' },
      animationSpeed: { type: String, default: 'normal' },
    },
    sections: {
      type: sectionsShape,
      default: {},
    },
  },
  { timestamps: true },
);

export const ThemeModel = mongoose.model<IThemeDocument>('Theme', themeSchema);
