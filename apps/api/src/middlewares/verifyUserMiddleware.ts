import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (!process.env.JWT_USER_SECRET) {
    res.status(500).send("Internal Server Error");
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_USER_SECRET) as {
      userId: string;
    };
    const user = await client.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    if (!user || !user.id) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    req.userId = user.id;
    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError &&
      error.name === "TokenExpiredError"
    ) {
      res.status(401).json({ message: "Unauthorized: Token expired" });
      return;
    }
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};
