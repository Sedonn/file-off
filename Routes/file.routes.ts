import express from 'express';
import multer from 'multer';

import * as FileControllers from '../Controllers/file.controllers';

import checkAuth from '../Middleware/auth.middleware';
import * as FileMiddleware from '../Middleware/file.middleware';

const router = express.Router();
const upload = multer();

router.post('/upload-file', checkAuth, upload.single('file'), ...FileMiddleware.uploadFileValidator, FileControllers.uploadFile);
router.get('/download-file', checkAuth, FileMiddleware.downloadFileValidator, FileControllers.downloadFile);
router.delete('/delete-file', checkAuth, FileMiddleware.deleteFileValidator, FileControllers.deleteFile);
router.get('/files', checkAuth, FileControllers.getUserFiles);
router.get('/downloads', checkAuth, FileControllers.getUserDownloads);

export default router;
