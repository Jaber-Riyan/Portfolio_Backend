import { blogsRepository } from './blogs.repository';
import { IBlogDocument } from './blogs.interface';
import { CreateBlogDto, UpdateBlogDto, BlogQueryDto } from './blogs.types';
import { BaseService } from '../../shared/helpers/baseService';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../core/storage/upload.service';
import { buildQuery, buildSort } from '../../shared/helpers/queryBuilder';
import { parsePagination, buildPaginationMeta } from '../../shared/helpers/pagination';
import { PaginatedResult } from '../../types';

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
    const slug = await ensureUniqueSlug(base);
    const payload: Partial<IBlogDocument> = { ...dto, slug } as unknown as Partial<IBlogDocument>;
    if (file) payload.image = UploadService.getRelativePath(file.path);
    return blogsRepository.create(payload);
  }

  async updateBlog(id: string, dto: UpdateBlogDto, file?: Express.Multer.File): Promise<IBlogDocument> {
    const existing = await blogsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Blog not found');
    const update: Partial<IBlogDocument> = { ...dto } as unknown as Partial<IBlogDocument>;
    if (dto.slug) update.slug = await ensureUniqueSlug(generateSlug(dto.slug), id);
    else if (dto.title && dto.title !== existing.title) {
      update.slug = await ensureUniqueSlug(generateSlug(dto.title), id);
    }
    if (file) update.image = await UploadService.handleImageUpdate(existing.image, file);
    const updated = await blogsRepository.updateById(id, update);
    if (!updated) throw ApiError.notFound('Blog not found');
    return updated;
  }

  async deleteBlog(id: string): Promise<IBlogDocument> {
    const blog = await blogsRepository.findById(id);
    if (!blog) throw ApiError.notFound('Blog not found');
    if (blog.image) await UploadService.removeFile(blog.image);
    const deleted = await blogsRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Blog not found');
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
    return updated;
  }
}

export const blogsService = new BlogsService();
