import { AxiosRequestConfig } from 'axios';
import { saveAs } from 'file-saver';

import { APIService } from './APIService';

/**
 * Upload the user file.
 * @param file
 * @param receiverLogin
 * @param expirePeriod
 */
export const uploadFile = async (
  file: File,
  receiverLogin: string,
  expirePeriod: string,
) => {
  const bodyData = new FormData();

  bodyData.append('file', file);
  bodyData.append('receiver', receiverLogin);
  bodyData.append('expireAt', expirePeriod);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  } satisfies AxiosRequestConfig;

  const { data } = await APIService.post<TUserUploadedFile>(
    '/file',
    bodyData,
    config,
  );

  return data;
};

/**
 * Delete the user file.
 * @param fileId
 */
export const deleteFile = async (fileId: string): Promise<void> =>
  APIService.delete('/file', { data: { fileId } });

export const downloadFile = async ({ _id: fileId, filename }: TUserFile) => {
  const { data: fileContent } = await APIService.get<string>('/file/download', {
    params: { fileId },
    responseType: 'blob',
  });

  saveAs(fileContent, filename);
};

/** Get a data about the all files uploaded by user. */
export const getUploadedFiles = async () => {
  const { data } = await APIService.get<TUserUploadedFile[]>('/file');

  return data;
};

/** Get a data about the all downloadable files by user. */
export const getDownloadableFiles = async () => {
  const { data } = await APIService.get<TUserDownloadableFile[]>(
    '/file/downloads',
  );

  return data;
};
