/** @fileoverview File routes. */

import express from 'express';
import multer from 'multer';

import {
  deleteFile,
  downloadFile,
  getDownloadableFiles,
  getUploadedFiles,
  uploadFile,
} from '../Controllers/file';
import {
  deleteFileSanitizer,
  deleteFileValidator,
  downloadFileSanitizer,
  downloadFileValidator,
  uploadFileValidator,
} from '../Middleware/validation/file';

const router = express.Router();
const upload = multer();

router.get('/', getUploadedFiles);

router.post('/', upload.single('file'), ...uploadFileValidator, uploadFile);

router.delete('/', deleteFileValidator, deleteFileSanitizer, deleteFile);

router.get('/download', downloadFileValidator, downloadFileSanitizer, downloadFile);

router.get('/downloads', getDownloadableFiles);

export default router;
