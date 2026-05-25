import mongoose, { Schema } from 'mongoose';
import { IGreetingDocument } from './greeting.interface';

const greetingSchema = new Schema<IGreetingDocument>(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    image: {
      url: { type: String, default: '' },
      key: { type: String, default: '' },
    },
    bgColor: { type: String, default: '#0f172a' },
    textColor: { type: String, default: '#ffffff' },
    ctaLabel: { type: String, required: true },
    ctaHref: { type: String, required: true },
  },
  { timestamps: true },
);

export const GreetingModel = mongoose.model<IGreetingDocument>('Greeting', greetingSchema);
