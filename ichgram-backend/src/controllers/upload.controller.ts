import { Request, Response } from 'express';

export const uploadFile = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Keine Datei hochgeladen.' });
      return;
    }
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Hochladen der Datei.' });
  }
};
