export interface CreateContactDto {
  headline: string;
  description: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}
