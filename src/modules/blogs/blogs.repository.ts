import { BlogModel } from './blogs.model';
import { IBlogDocument } from './blogs.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class BlogsRepository extends BaseRepository<IBlogDocument> {
  constructor() { super(BlogModel); }

  async findBySlug(slug: string): Promise<IBlogDocument | null> {
    return BlogModel.findOne({ slug });
  }
}

export const blogsRepository = new BlogsRepository();
