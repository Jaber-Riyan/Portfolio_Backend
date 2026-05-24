import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<TDoc extends Document> {
  constructor(protected readonly model: Model<TDoc>) {}

  async findAll(
    filter: FilterQuery<TDoc> = {},
    sort: Record<string, 1 | -1> = { sortOrder: 1 },
  ): Promise<TDoc[]> {
    return this.model.find(filter).sort(sort as Parameters<ReturnType<typeof this.model.find>['sort']>[0]);
  }

  async findById(id: string): Promise<TDoc | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<TDoc>): Promise<TDoc | null> {
    return this.model.findOne(filter);
  }

  async create(data: Partial<TDoc>): Promise<TDoc> {
    return this.model.create(data);
  }

  async updateById(
    id: string,
    update: UpdateQuery<TDoc>,
  ): Promise<TDoc | null> {
    return this.model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<TDoc | null> {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<TDoc> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async findWithPagination(
    filter: FilterQuery<TDoc>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
  ): Promise<{ data: TDoc[]; total: number }> {
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort as Parameters<ReturnType<typeof this.model.find>['sort']>[0])
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { data, total };
  }
}
