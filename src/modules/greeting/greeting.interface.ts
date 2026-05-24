import { Document } from 'mongoose';

export interface IGreeting {
  enabled: boolean;
  title: string;
  message: string;
  image?: string;
  bgColor: string;
  textColor: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface IGreetingDocument extends IGreeting, Document {}
