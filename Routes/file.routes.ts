import express from 'express';
import multer from 'multer';

import { FileControllers } from '../Controllers/file.controllers';

const router = express.Router();
const upload = multer();

router.post('/upload-file', upload.single('file'), FileControllers.uploadFile);
router.get('/download-file', FileControllers.downloadFile);

export default router;