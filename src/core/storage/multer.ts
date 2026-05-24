import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, UPLOAD_FOLDERS } from '../../shared/constants';
import { ApiError } from '../../shared/errors/ApiError';
import { env } from '../../config/env';

const ensureDir = async (dir: string): Promise<void> => {
  await fs.mkdir(dir, { recursive: true });
};

const createStorage = (folder: string): StorageEngine => {
  return multer.diskStorage({
    destination: async (_req, _file, cb) => {
      const dest = path.join(process.cwd(), env.uploadDir, folder);
      await ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });
};

const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`));
  }
};

export const createUploader = (folder: string) =>
  multer({
    storage: createStorage(folder),
    fileFilter: imageFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  });

export const uploaders = {
  hero: createUploader(UPLOAD_FOLDERS.HERO),
  projects: createUploader(UPLOAD_FOLDERS.PROJECTS),
  blogs: createUploader(UPLOAD_FOLDERS.BLOGS),
  reviews: createUploader(UPLOAD_FOLDERS.REVIEWS),
  greeting: createUploader(UPLOAD_FOLDERS.GREETING),
  theme: createUploader(UPLOAD_FOLDERS.THEME),
  temp: createUploader(UPLOAD_FOLDERS.TEMP),
};
