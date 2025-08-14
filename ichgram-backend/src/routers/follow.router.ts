// src/routes/follow.router.ts
import { Router } from "express";
import {
  followUnfollowUser,
  getFollowers,
  getFollowing,
  getFollowFeed
} from "../controllers/follow.controller";
import { authenticate } from "../middlewares/authorization"; 

const followRouter = Router();

followRouter.post("/:id", authenticate, followUnfollowUser);

followRouter.get("/followers/:id", getFollowers);

followRouter.get("/following/:id", getFollowing);

followRouter.get("/feed", authenticate, getFollowFeed)

export default followRouter;
