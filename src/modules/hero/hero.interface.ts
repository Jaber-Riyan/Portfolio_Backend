import { Document } from 'mongoose';

export interface ICtaButton {
  label: string;
  href: string;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface IHero {
  name: string;
  role: string;
  description: string;
  profileImage: string;
  primaryCta: ICtaButton;
  secondaryCta: ICtaButton;
  socialLinks: ISocialLinks;
}

export interface IHeroDocument extends IHero, Document {}
