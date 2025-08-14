import { Router } from "express";
import {
  feedController,
  userPostsController,
  postByIdController,
  createPostController,
  updatePostController,
  patchPostController,
  deletePostController
} from "../controllers/post.controller";

import { addComment, getComments } from "../controllers/comment.controller";
import { likeController } from "../controllers/like.controller";
import { authenticate } from "../middlewares/authorization";
import upload from "../middlewares/upload";

const postRouter = Router();

postRouter.get("/feed", authenticate, feedController);
postRouter.get("/user/:id", authenticate, userPostsController);
postRouter.get("/:id", authenticate, postByIdController);

postRouter.post("/", authenticate, upload.single("image"), createPostController);
postRouter.post("/:id/comments", authenticate, addComment);
postRouter.post("/:id/like", authenticate, likeController);


postRouter.get("/:id/comments", authenticate, getComments);
postRouter.put("/:id", authenticate, upload.single("image"), updatePostController);
postRouter.patch("/:id", authenticate, patchPostController);

postRouter.delete("/:id", authenticate, deletePostController);




export default postRouter;
