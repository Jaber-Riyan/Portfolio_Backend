import { Document } from 'mongoose';
import { IUploadedImage } from '../../types';

export interface IGreeting {
  enabled: boolean;
  title: string;
  message: string;
  image?: IUploadedImage;
  bgColor: string;
  textColor: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface IGreetingDocument extends IGreeting, Document {}
