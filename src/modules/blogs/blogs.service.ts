import { blogsRepository } from './blogs.repository';
import { IBlogDocument } from './blogs.interface';
import { CreateBlogDto, UpdateBlogDto, BlogQueryDto } from './blogs.types';
import { BaseService } from '../../shared/helpers/baseService';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../services/upload.service';
import { buildQuery, buildSort } from '../../shared/helpers/queryBuilder';
import { parsePagination, buildPaginationMeta } from '../../shared/helpers/pagination';
import { PaginatedResult } from '../../types';
import { knowledgeService } from '../knowledge/knowledge.service';
import { Types } from 'mongoose';
import { logger } from '../../shared/logger/logger';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ensureUniqueSlug = async (base: string, excludeId?: string): Promise<string> => {
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await blogsRepository.findBySlug(slug);
    if (!existing || existing._id.toString() === excludeId) return slug;
    slug = `${base}-${counter++}`;
  }
};

class BlogsService extends BaseService<IBlogDocument, typeof blogsRepository> {
  constructor() { super(blogsRepository); }

  async getBlogs(query: BlogQueryDto): Promise<PaginatedResult<IBlogDocument>> {
    const { page, limit, skip } = parsePagination(query.page, query.limit);
    const filter = buildQuery<IBlogDocument>({
      search: query.search,
      searchFields: ['title', 'excerpt'],
      published: query.published,
    });
    const sort = buildSort('sortOrder', 'asc');
    const { data, total } = await blogsRepository.findWithPagination(filter, skip, limit, sort);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async createBlog(dto: CreateBlogDto, file?: Express.Multer.File): Promise<IBlogDocument> {
    const base = generateSlug(dto.slug ?? dto.title);
    const existing = await blogsRepository.findBySlug(base);
    if (existing) {
      const update: Partial<IBlogDocument> = { ...dto } as unknown as Partial<IBlogDocument>;
      if (dto.slug) update.slug = await ensureUniqueSlug(generateSlug(dto.slug), existing._id.toString());
      if (file) update.image = await UploadService.replace(existing.image, file);
      const updated = (await blogsRepository.updateById(existing._id.toString(), update))!;
      this.syncKnowledge(updated._id as Types.ObjectId);
      return updated;
    }
    const slug = await ensureUniqueSlug(base);
    const payload: Partial<IBlogDocument> = { ...dto, slug } as unknown as Partial<IBlogDocument>;
    if (file) payload.image = await UploadService.upload(file);
    const created = await blogsRepository.create(payload);
    this.syncKnowledge(created._id as Types.ObjectId);
    return created;
  }

  async updateBlog(id: string, dto: UpdateBlogDto, file?: Express.Multer.File): Promise<IBlogDocument> {
    const existing = await blogsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Blog not found');
    const update: Partial<IBlogDocument> = { ...dto } as unknown as Partial<IBlogDocument>;
    if (dto.slug) update.slug = await ensureUniqueSlug(generateSlug(dto.slug), id);
    else if (dto.title && dto.title !== existing.title) {
      update.slug = await ensureUniqueSlug(generateSlug(dto.title), id);
    }
    if (file) update.image = await UploadService.replace(existing.image, file);
    const updated = await blogsRepository.updateById(id, update);
    if (!updated) throw ApiError.notFound('Blog not found');
    this.syncKnowledge(updated._id as Types.ObjectId);
    return updated;
  }

  async deleteBlog(id: string): Promise<IBlogDocument> {
    const blog = await blogsRepository.findById(id);
    if (!blog) throw ApiError.notFound('Blog not found');
    await UploadService.remove(blog.image);
    const deleted = await blogsRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Blog not found');
    knowledgeService
      .deleteChunks('blog', deleted._id as Types.ObjectId)
      .catch((err) => logger.warn('[Knowledge] Failed to delete blog chunk:', err));
    return deleted;
  }

  async togglePublish(id: string): Promise<IBlogDocument> {
    const blog = await blogsRepository.findById(id);
    if (!blog) throw ApiError.notFound('Blog not found');
    const updated = await blogsRepository.updateById(id, {
      published: !blog.published,
      draft: blog.published,
    });
    if (!updated) throw ApiError.notFound('Blog not found');
    // Re-sync: indexBlogById will remove the chunk if now unpublished
    this.syncKnowledge(updated._id as Types.ObjectId);
    return updated;
  }

  private syncKnowledge(id: Types.ObjectId): void {
    knowledgeService
      .indexBlogById(id)
      .catch((err) => logger.warn('[Knowledge] Failed to index blog:', err));
  }
}

export const blogsService = new BlogsService();
