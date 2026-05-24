import { IGithubLink } from './projects.interface';

export interface CreateProjectDto {
  title: string;
  image?: string;
  techStack?: string[];
  summary: string;
  description: string;
  githubLinks?: IGithubLink[];
  live?: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface ProjectQueryDto {
  page?: string;
  limit?: string;
  featured?: string;
  search?: string;
}
