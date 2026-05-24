export interface CreateBlogDto {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  image?: string;
  tags?: string[];
  link?: string;
  readTime?: number;
  published?: boolean;
  draft?: boolean;
  sortOrder?: number;
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> {}

export interface BlogQueryDto {
  page?: string;
  limit?: string;
  search?: string;
  published?: string;
}
