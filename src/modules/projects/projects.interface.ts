import { Document } from 'mongoose';

export interface IGithubLink {
  label: string;
  url: string;
}

export interface IProject {
  title: string;
  image: string;
  techStack: string[];
  summary: string;
  description: string;
  githubLinks: IGithubLink[];
  live?: string;
  featured: boolean;
  sortOrder: number;
}

export interface IProjectDocument extends IProject, Document {}
