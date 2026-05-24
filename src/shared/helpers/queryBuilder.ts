import { FilterQuery } from 'mongoose';

export interface QueryOptions {
  search?: string;
  searchFields?: string[];
  featured?: string;
  published?: string;
  sortBy?: string;
  order?: string;
}

export const buildQuery = <T>(opts: QueryOptions): FilterQuery<T> => {
  const filter: Record<string, unknown> = {};

  if (opts.search && opts.searchFields && opts.searchFields.length > 0) {
    filter['$or'] = opts.searchFields.map((field) => ({
      [field]: { $regex: opts.search, $options: 'i' },
    }));
  }

  if (opts.featured !== undefined) {
    filter['featured'] = opts.featured === 'true';
  }

  if (opts.published !== undefined) {
    filter['published'] = opts.published === 'true';
  }

  return filter as FilterQuery<T>;
};

export const buildSort = (
  sortBy = 'sortOrder',
  order = 'asc',
): Record<string, 1 | -1> => {
  return { [sortBy]: order === 'desc' ? -1 : 1 };
};
