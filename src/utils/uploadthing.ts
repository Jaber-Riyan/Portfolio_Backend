import { UTApi, UTFile } from 'uploadthing/server';

const utapi = new UTApi();

export const uploadImage = async (file: Express.Multer.File): Promise<{ url: string; key: string }> => {
  // UTFilePropertyBag typings omit `type`, but UTFile extends File and it is passed through at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const utFile = new UTFile([file.buffer], file.originalname, { type: file.mimetype } as any);
  const [result] = await utapi.uploadFiles([utFile]);
  if (result.error || !result.data) {
    throw new Error(result.error?.message ?? 'Upload to UploadThing failed');
  }
  return { url: result.data.url, key: result.data.key };
};

export const deleteImage = async (key: string): Promise<void> => {
  if (!key) return;
  await utapi.deleteFiles([key]);
};
