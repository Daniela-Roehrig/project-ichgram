import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import { Request, Response, NextFunction } from "express";

import notFoundHandler from "./middlewares/notFoundHandler";
import errorHandler from "./middlewares/errorHandler";

import authRouter from "./routers/auth.router";
import myProfileRouter from "./routers/myProfile.router";
import usersRouter from "./routers/users.router";
import uploadRouter from "./routers/upload.router";
import postRouter from "./routers/post.router";
import messagesRouter from "./routers/message.router";
import followRouter from "./routers/follow.router";
import commentRouter from "./routers/comment.router"
import likeRouter from "./routers/like.router";
import notificationRouter from "./routers/notification.router";

const startServer = (): void => {
  const app: Express = express();
  const httpServer = createServer(app);

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(cookieParser());

  app.use((req, _, next) => {
    next();
  });

  app.get("/test", (_, res) => {
    res.json({ message: "Test Route funktioniert" });
  });

  app.use("/uploads", express.static(path.join(__dirname, "../temp")));

  app.use("/api/auth", authRouter);
  app.use("/api/profile", myProfileRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/follow", followRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/likes", likeRouter);
  app.use("/api/notifications", notificationRouter)

  app.use(notFoundHandler);
  app.use(errorHandler);
  
 app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

  const port = Number(process.env.PORT) || 3000;
  httpServer.listen(port, () => {
    console.log(` Express-Server läuft auf Port ${port}`);
  });
};

export default startServer;
