
import express from "express";
import { addComment, getComments, deleteComment, likeComment} from "../controllers/comment.controller";
import { authenticate } from "../middlewares/authorization";

const commentRouter = express.Router();

commentRouter.post("/:postId", authenticate, addComment);
commentRouter.get("/:postId", getComments);
commentRouter.delete("/:commentId", authenticate, deleteComment);
commentRouter.post("/:commentId/like", authenticate, likeComment)


export default commentRouter;
