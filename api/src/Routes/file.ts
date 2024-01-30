/** @fileoverview File routes. */

import express from 'express';
import multer from 'multer';

import {
  deleteFile,
  downloadFile,
  getDownloadableFiles,
  getUploadedFiles,
  uploadFile,
} from '@/Controllers/file.ts';
import {
  deleteFileSanitizer,
  deleteFileValidator,
  downloadFileSanitizer,
  downloadFileValidator,
  uploadFileValidator,
} from '@/Middleware/validation/file.ts';

export const fileRouter = express.Router();
const upload = multer();

fileRouter.get('/', getUploadedFiles);

fileRouter.post('/', upload.single('file'), ...uploadFileValidator, uploadFile);

fileRouter.delete('/', deleteFileValidator, deleteFileSanitizer, deleteFile);

fileRouter.get('/download', downloadFileValidator, downloadFileSanitizer, downloadFile);

fileRouter.get('/downloads', getDownloadableFiles);
