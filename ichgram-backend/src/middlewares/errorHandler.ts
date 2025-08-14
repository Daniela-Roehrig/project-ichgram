import { Request, Response, NextFunction } from "express";


const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error caught by errorHandler:", error.message);
  if (error.stack) console.error(error.stack);
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).json({ message });
};
 export default errorHandler;