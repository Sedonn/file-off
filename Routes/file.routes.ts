import express from 'express';
import multer from 'multer';

import { FileControllers } from '../Controllers/file.controllers';

import checkAuth from '../Middleware/auth.middleware'

const router = express.Router();
const upload = multer();

router.post('/upload-file', upload.single('file'), FileControllers.uploadFile);
router.get('/download-file', checkAuth, FileControllers.downloadFile);

export default router;