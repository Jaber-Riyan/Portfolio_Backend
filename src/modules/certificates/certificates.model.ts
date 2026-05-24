import mongoose, { Schema } from 'mongoose';
import { ICertificateDocument } from './certificates.interface';

const certificateSchema = new Schema<ICertificateDocument>(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    link: { type: String, default: '' },
    learned: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

certificateSchema.index({ sortOrder: 1 });

export const CertificateModel = mongoose.model<ICertificateDocument>('Certificate', certificateSchema);
