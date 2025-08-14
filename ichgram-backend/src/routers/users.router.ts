import { Router, Request, Response } from "express";
import User from "../db/models/User";
import { getUserByIdController, searchUsersController } from "../controllers/users.controller";
import { authenticate } from "../middlewares/authorization";

const usersRouter: Router = Router();
usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find().limit(50); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler beim Laden aller User:", error);
    res.status(500).json({ message: "Server Fehler" });
  }
});

usersRouter.get("/search", authenticate, async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ message: "Keine Suchanfrage angegeben." });
  } 

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" }, 
    }).limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler bei der Benutzersuche:", error);
    res.status(500).json({ message: "Fehler bei der Benutzersuche." });
  }
});

usersRouter.get("/:id", authenticate, getUserByIdController);

export default usersRouter;