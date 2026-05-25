import mongoose, { Schema } from 'mongoose';
import { IHeroDocument } from './hero.interface';

const ctaSchema = new Schema(
  { label: { type: String, required: true }, href: { type: String, required: true } },
  { _id: false },
);

const imageSchema = new Schema(
  { url: { type: String, default: '' }, key: { type: String, default: '' } },
  { _id: false },
);

const heroSchema = new Schema<IHeroDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    profileImage: { type: imageSchema, default: () => ({ url: '', key: '' }) },
    primaryCta: { type: ctaSchema, required: true },
    secondaryCta: { type: ctaSchema, required: true },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

export const HeroModel = mongoose.model<IHeroDocument>('Hero', heroSchema);
