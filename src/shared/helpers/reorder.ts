import { Model, Document } from 'mongoose';
import { ApiError } from '../errors/ApiError';

export const reorderDocuments = async <T extends Document>(
  model: Model<T>,
  ids: string[],
): Promise<void> => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest('ids array is required for reorder');
  }

  const bulkOps = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { sortOrder: index } },
    },
  }));

  await model.bulkWrite(bulkOps as Parameters<typeof model.bulkWrite>[0]);
};
