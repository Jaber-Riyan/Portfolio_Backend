export interface CreateCertificateDto {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  learned: string;
  sortOrder?: number;
}

export interface UpdateCertificateDto extends Partial<CreateCertificateDto> {}
