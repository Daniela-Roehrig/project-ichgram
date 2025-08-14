import { Router } from "express";
import upload from "../middlewares/upload";

import {
  getMyProfileController,
  updateMyProfileController,
  changePasswordController,
} from "../controllers/myProfile.controller";

import { authenticate } from "../middlewares/authorization";

const myProfileRouter: Router = Router();

myProfileRouter.get("/", authenticate, getMyProfileController);
myProfileRouter.put(
  "/",
  authenticate,
  upload.single("avatar"),
  updateMyProfileController
); 
myProfileRouter.post("/change-password", authenticate, changePasswordController)

export default myProfileRouter;
