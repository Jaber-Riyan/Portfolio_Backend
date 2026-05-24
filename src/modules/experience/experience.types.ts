export interface CreateExperienceDto {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  location: string;
  description: string;
  impact?: string[];
  sortOrder?: number;
}

export interface UpdateExperienceDto extends Partial<CreateExperienceDto> {}
