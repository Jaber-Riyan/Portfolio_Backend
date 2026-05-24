export const ROLES = {
  ADMIN: 'admin',
} as const;

export const COOKIE_NAME = 'token';

export const UPLOAD_FOLDERS = {
  HERO: 'hero',
  PROJECTS: 'projects',
  BLOGS: 'blogs',
  REVIEWS: 'reviews',
  GREETING: 'greeting',
  THEME: 'theme',
  TEMP: 'temp',
} as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const SECTION_NAMES = [
  'hero',
  'about',
  'skills',
  'experience',
  'projects',
  'education',
  'certificates',
  'reviews',
  'blogs',
  'contact',
] as const;

export type SectionName = typeof SECTION_NAMES[number];
