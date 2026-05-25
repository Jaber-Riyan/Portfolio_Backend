import { uploadImage, deleteImage } from '../utils/uploadthing';
import { IUploadedImage } from '../types';

export class UploadService {
  static async upload(file: Express.Multer.File): Promise<IUploadedImage> {
    return uploadImage(file);
  }

  static async replace(
    existing: IUploadedImage | undefined | null,
    newFile: Express.Multer.File,
  ): Promise<IUploadedImage> {
    if (existing?.key) {
      deleteImage(existing.key).catch(() => {});
    }
    return uploadImage(newFile);
  }

  static async remove(image: IUploadedImage | undefined | null): Promise<void> {
    if (image?.key) {
      await deleteImage(image.key).catch(() => {});
    }
  }
}
