import { ProjectModel } from './projects.model';
import { IProjectDocument } from './projects.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class ProjectsRepository extends BaseRepository<IProjectDocument> {
  constructor() { super(ProjectModel); }
}

export const projectsRepository = new ProjectsRepository();
