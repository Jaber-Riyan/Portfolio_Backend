export interface CreateAboutDto {
  intro: string;
  journey: string;
  work: string;
  hobbies: string;
  belief: string;
}

export interface UpdateAboutDto extends Partial<CreateAboutDto> {}
