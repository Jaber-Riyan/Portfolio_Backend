export interface CreateEducationDto {
  degree: string;
  school: string;
  period: string;
  summary: string;
  sortOrder?: number;
}

export interface UpdateEducationDto extends Partial<CreateEducationDto> {}
