export interface CreateGreetingDto {
  enabled?: boolean;
  title: string;
  message: string;
  image?: string;
  bgColor?: string;
  textColor?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface UpdateGreetingDto extends Partial<CreateGreetingDto> {}
