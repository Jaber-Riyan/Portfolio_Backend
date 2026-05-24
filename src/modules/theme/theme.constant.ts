import { ITheme } from './theme.interface';

export const THEME_MESSAGES = {
  FETCHED: 'Theme fetched successfully',
  UPDATED: 'Theme updated successfully',
  SECTION_UPDATED: 'Section theme updated successfully',
} as const;

export const DEFAULT_SECTION_THEME = {
  bg: '#0f172a',
  text: '#f1f5f9',
  accent: '#6366f1',
  bgImage: '',
};

export const DEFAULT_THEME: ITheme = {
  global: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    text: '#f1f5f9',
    muted: '#64748b',
    panel: '#1e293b',
    animationSpeed: 'normal',
  },
  sections: {
    hero: { ...DEFAULT_SECTION_THEME },
    about: { ...DEFAULT_SECTION_THEME },
    skills: { ...DEFAULT_SECTION_THEME },
    experience: { ...DEFAULT_SECTION_THEME },
    projects: { ...DEFAULT_SECTION_THEME },
    education: { ...DEFAULT_SECTION_THEME },
    certificates: { ...DEFAULT_SECTION_THEME },
    reviews: { ...DEFAULT_SECTION_THEME },
    blogs: { ...DEFAULT_SECTION_THEME },
    contact: { ...DEFAULT_SECTION_THEME },
  },
};
