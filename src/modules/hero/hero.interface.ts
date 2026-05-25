import { Document } from 'mongoose';
import { IUploadedImage } from '../../types';

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
  profileImage: IUploadedImage;
  primaryCta: ICtaButton;
  secondaryCta: ICtaButton;
  socialLinks: ISocialLinks;
}

export interface IHeroDocument extends IHero, Document {}
