import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); 
  },
});

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nur JPEG- und PNG-Dateien sind erlaubt.'));
  }
}


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

export default upload;
