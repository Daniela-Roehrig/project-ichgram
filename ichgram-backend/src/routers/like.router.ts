import express from "express";
import { likeController, getLikes } from "../controllers/like.controller";
import { authenticate } from "../middlewares/authorization";

const likeRouter = express.Router();

likeRouter.post("/:postId", authenticate, likeController); 
likeRouter.get("/:postId", authenticate, getLikes);

export default likeRouter;
