import { projectsRepository } from './projects.repository';
import { IProjectDocument } from './projects.interface';
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from './projects.types';
import { BaseService } from '../../shared/helpers/baseService';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../core/storage/upload.service';
import { buildQuery, buildSort } from '../../shared/helpers/queryBuilder';
import { parsePagination, buildPaginationMeta } from '../../shared/helpers/pagination';
import { reorderDocuments } from '../../shared/helpers/reorder';
import { ProjectModel } from './projects.model';
import { PaginatedResult } from '../../types';

class ProjectsService extends BaseService<IProjectDocument, typeof projectsRepository> {
  constructor() { super(projectsRepository); }

  async getProjects(query: ProjectQueryDto): Promise<PaginatedResult<IProjectDocument>> {
    const { page, limit, skip } = parsePagination(query.page, query.limit);
    const filter = buildQuery<IProjectDocument>({
      search: query.search,
      searchFields: ['title'],
      featured: query.featured,
    });
    const sort = buildSort('sortOrder', 'asc');
    const { data, total } = await projectsRepository.findWithPagination(filter, skip, limit, sort);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async createProject(dto: CreateProjectDto, file?: Express.Multer.File): Promise<IProjectDocument> {
    const payload: Partial<IProjectDocument> = { ...dto } as unknown as Partial<IProjectDocument>;
    if (file) payload.image = UploadService.getRelativePath(file.path);
    return projectsRepository.create(payload);
  }

  async updateProject(id: string, dto: UpdateProjectDto, file?: Express.Multer.File): Promise<IProjectDocument> {
    const existing = await projectsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Project not found');
    const update: Partial<IProjectDocument> = { ...dto } as unknown as Partial<IProjectDocument>;
    if (file) update.image = await UploadService.handleImageUpdate(existing.image, file);
    const updated = await projectsRepository.updateById(id, update);
    if (!updated) throw ApiError.notFound('Project not found');
    return updated;
  }

  async deleteProject(id: string): Promise<IProjectDocument> {
    const project = await projectsRepository.findById(id);
    if (!project) throw ApiError.notFound('Project not found');
    if (project.image) await UploadService.removeFile(project.image);
    const deleted = await projectsRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Project not found');
    return deleted;
  }

  async reorder(ids: string[]): Promise<void> {
    await reorderDocuments(ProjectModel, ids);
  }
}

export const projectsService = new ProjectsService();
