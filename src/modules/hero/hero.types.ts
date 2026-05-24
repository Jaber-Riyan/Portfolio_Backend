import { ICtaButton, ISocialLinks } from './hero.interface';

export interface CreateHeroDto {
  name: string;
  role: string;
  description: string;
  profileImage?: string;
  primaryCta: ICtaButton;
  secondaryCta: ICtaButton;
  socialLinks?: ISocialLinks;
}

export interface UpdateHeroDto extends Partial<CreateHeroDto> {}
