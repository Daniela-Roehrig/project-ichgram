
import multer, { StorageEngine, Options, FileFilterCallback } from "multer";
import * as path from "node:path";
import { Request } from "express";

import HttpExeption from "../utils/HttpExeption";

type FileNameCallback = (error: Error | null, filename: string) => void;

const storage: StorageEngine = multer.diskStorage({

 destination: path.resolve(__dirname, "..", "..", "temp"),

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    const uniquePrefix: string = `${Date.now()}_${Math.round(
      Math.random() * 1e9
    )}`;

    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");

    const filename: string = `${uniquePrefix}_${safeName}`;
    callback(null, filename);
  },
});

const limits: Options["limits"] = {
  fileSize: 1024 * 1024 * 10,
};

const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  const extension = path.extname(file.originalname).toLowerCase().replace(".", "");

  if (extension === "exe") {
    return callback(HttpExeption(400, ".exe files are not allowed"));
  }

  if (!allowedExtensions.includes(extension)) {
    return callback(
      HttpExeption(
        400,
        `File type .${extension} is not allowed. Allowed types: ${allowedExtensions.join(", ")}`
      )
    );
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
