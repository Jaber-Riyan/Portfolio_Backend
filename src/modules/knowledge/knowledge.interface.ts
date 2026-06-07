import { Document, Types } from 'mongoose';

export type KnowledgeSourceType =
  | 'hero'
  | 'about'
  | 'project'
  | 'experience'
  | 'education'
  | 'certificate'
  | 'review'
  | 'blog'
  | 'contact'
  | 'skill';

export interface IKnowledgeChunk {
  sourceType: KnowledgeSourceType;
  sourceId: Types.ObjectId;
  title: string;
  content: string;
  embedding: number[];
}

export interface IKnowledgeChunkDocument extends IKnowledgeChunk, Document {
  createdAt: Date;
  updatedAt: Date;
}
