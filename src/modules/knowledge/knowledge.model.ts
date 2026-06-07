import mongoose, { Schema } from 'mongoose';
import { IKnowledgeChunkDocument } from './knowledge.interface';
import { KNOWLEDGE_SOURCE_TYPES } from './knowledge.constant';

const knowledgeChunkSchema = new Schema<IKnowledgeChunkDocument>(
  {
    sourceType: {
      type: String,
      required: true,
      enum: KNOWLEDGE_SOURCE_TYPES,
      index: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    // select: false keeps the large embedding array out of normal queries
    embedding: {
      type: [Number],
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

// Compound unique index: one chunk per (sourceType, sourceId) pair
knowledgeChunkSchema.index({ sourceType: 1, sourceId: 1 }, { unique: true });

export const KnowledgeChunkModel = mongoose.model<IKnowledgeChunkDocument>(
  'KnowledgeChunk',
  knowledgeChunkSchema,
  'knowledge_chunks', // explicit collection name as required
);
