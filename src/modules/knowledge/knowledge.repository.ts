import { Types } from 'mongoose';
import { KnowledgeChunkModel } from './knowledge.model';
import { IKnowledgeChunkDocument, KnowledgeSourceType } from './knowledge.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';
import { VECTOR_INDEX_NAME } from './knowledge.constant';
import { logger } from '../../shared/logger/logger';

export interface VectorSearchResult {
  sourceType: KnowledgeSourceType;
  title: string;
  content: string;
  score: number;
}

export class KnowledgeRepository extends BaseRepository<IKnowledgeChunkDocument> {
  constructor() {
    super(KnowledgeChunkModel);
  }

  async upsertChunk(
    sourceType: KnowledgeSourceType,
    sourceId: Types.ObjectId,
    title: string,
    content: string,
    embedding: number[],
  ): Promise<void> {
    await KnowledgeChunkModel.findOneAndUpdate(
      { sourceType, sourceId },
      { $set: { title, content, embedding } },
      { upsert: true },
    );
  }

  async deleteBySource(sourceType: KnowledgeSourceType, sourceId: Types.ObjectId): Promise<void> {
    await KnowledgeChunkModel.deleteMany({ sourceType, sourceId });
  }

  async deleteBySourceType(sourceType: KnowledgeSourceType): Promise<void> {
    await KnowledgeChunkModel.deleteMany({ sourceType });
  }

  async getStats(): Promise<Record<string, number>> {
    const pipeline = [
      { $group: { _id: '$sourceType', count: { $sum: 1 } } },
    ];
    const results = await KnowledgeChunkModel.aggregate<{ _id: string; count: number }>(pipeline);
    return results.reduce<Record<string, number>>((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});
  }

  async vectorSearch(queryEmbedding: number[], limit = 5): Promise<VectorSearchResult[]> {
    try {
      return await KnowledgeChunkModel.aggregate<VectorSearchResult>([
        {
          $vectorSearch: {
            index: VECTOR_INDEX_NAME,
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: limit * 15,
            limit,
          },
        },
        {
          $project: {
            _id: 0,
            sourceType: 1,
            title: 1,
            content: 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ]);
    } catch (err: unknown) {
      // Gracefully degrade if Atlas vector index is not configured
      const message = err instanceof Error ? err.message : String(err);
      logger.warn(`[Knowledge] Vector search unavailable: ${message}`);
      return [];
    }
  }
}

export const knowledgeRepository = new KnowledgeRepository();
