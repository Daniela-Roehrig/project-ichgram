import { Router } from "express";
import { searchUsers } from "../controllers/search.controller"; 
import { authenticate } from "../middlewares/authorization";

const searchRouter = Router();

searchRouter.get("/users", authenticate, searchUsers);

export default searchRouter;
