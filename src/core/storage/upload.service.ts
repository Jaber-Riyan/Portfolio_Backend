import path from 'path';
import { deleteFile } from './fileDelete';
import { env } from '../../config/env';

export class UploadService {
  static getRelativePath(absolutePath: string): string {
    const cwd = process.cwd();
    return absolutePath.startsWith(cwd)
      ? absolutePath.slice(cwd.length + 1).replace(/\\/g, '/')
      : absolutePath.replace(/\\/g, '/');
  }

  static getPublicUrl(relativePath: string): string {
    return `/${relativePath.replace(/\\/g, '/')}`;
  }

  /**
   * Called after a new file has been uploaded by multer.
   * Deletes the old file if it exists, returns the relative path of the new file.
   */
  static async handleImageUpdate(
    oldPath: string | undefined | null,
    newFile: Express.Multer.File,
  ): Promise<string> {
    if (oldPath) {
      const absolute = path.isAbsolute(oldPath)
        ? oldPath
        : path.join(process.cwd(), oldPath);
      await deleteFile(absolute);
    }

    return UploadService.getRelativePath(newFile.path);
  }

  /**
   * Deletes a file given its stored relative/absolute path.
   */
  static async removeFile(storedPath: string): Promise<void> {
    if (!storedPath) return;
    const absolute = path.isAbsolute(storedPath)
      ? storedPath
      : path.join(process.cwd(), storedPath);
    await deleteFile(absolute);
  }

  static buildUploadDirs(): string[] {
    return Object.values({ ...require('../../shared/constants').UPLOAD_FOLDERS }).map(
      (folder) => path.join(process.cwd(), env.uploadDir, folder as string),
    );
  }
}
