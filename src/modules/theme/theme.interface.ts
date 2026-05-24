import { Document } from 'mongoose';
import { SectionName } from '../../shared/constants';

export interface ISectionTheme {
  bg: string;
  text: string;
  accent: string;
  bgImage?: string;
}

export interface IGlobalTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  muted: string;
  panel: string;
  animationSpeed: string;
}

export type ISectionThemes = Record<SectionName, ISectionTheme>;

export interface ITheme {
  global: IGlobalTheme;
  sections: ISectionThemes;
}

export interface IThemeDocument extends ITheme, Document {}
