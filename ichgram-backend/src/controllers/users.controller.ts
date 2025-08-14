
import { Request, Response } from "express";

import * as usersService from "../services/users.service";

import { PublicUserResponse } from "../db/models/User";
import User from "../db/models/User"; 

export const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const result: PublicUserResponse = await usersService.getUserById(id);

  res.json(result);
};

export const searchUsersController = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ message: "Suchanfrage fehlt." });
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
};