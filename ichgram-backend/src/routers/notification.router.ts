import express from "express";
import { authenticate } from "../middlewares/authorization"; 
import { getNotifications } from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get("/", authenticate, getNotifications);

export default notificationRouter;
