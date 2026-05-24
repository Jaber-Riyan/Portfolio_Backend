export interface CreateReviewDto {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface UpdateReviewDto extends Partial<CreateReviewDto> {}
