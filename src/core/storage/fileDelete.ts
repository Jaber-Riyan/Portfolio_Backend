import fs from 'fs/promises';
import path from 'path';
import { logger } from '../../shared/logger/logger';

export const deleteFile = async (filePath: string): Promise<void> => {
  if (!filePath) return;

  try {
    const absolute = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    await fs.access(absolute);
    await fs.unlink(absolute);
    logger.debug(`Deleted file: ${absolute}`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.warn(`Could not delete file ${filePath}:`, err);
    }
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const absolute = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    await fs.access(absolute);
    return true;
  } catch {
    return false;
  }
};
