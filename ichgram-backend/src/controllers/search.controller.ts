
import { Request, Response } from "express";
import User from "../db/models/User";

export const searchUsers = async (req: Request, res: Response) => {
    console.log('searchUsers Query:', req.query);

  try {
    const { query, sort = "username", order = "asc" } = req.query;

   /*  if (typeof query !== "string") {
      return res.status(400).json({ message: "Ungültiger Suchbegriff." });
    } */

    const searchFilter = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } }
      ]
    };

    const allowedSortFields = ["username", "fullname"];
    const sortField = allowedSortFields.includes(sort as string) ? (sort as string) : "username";
    const sortOrder: 1 | -1 = order === "desc" ? -1 : 1;

    const users = await User.find(searchFilter)
      .sort([[sortField, sortOrder]]) 
      .limit(50)
      .select("_id username fullname avatar"); 

    res.json(users);
  } catch (err) {
    console.error("Fehler bei der Benutzersuche:", err);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
};
