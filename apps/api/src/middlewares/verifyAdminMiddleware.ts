import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";

export const verifyAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("verifyAdminMiddleware");
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });

    return;
  }
  if (!process.env.JWT_ADMIN_SECRET) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_ADMIN_SECRET) as {
      userId: string;
    };
    const user = await client.admin.findUnique({
      where: {
        id: decodedToken.userId,
      },
    });
    if (!user || !user.id) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    req.userId = user.id;
    next();
  } catch (error) {
    console.log(error);
    if (
      error instanceof jwt.JsonWebTokenError &&
      error.name === "TokenExpiredError"
    ) {
      res.status(401).json({ message: "Unauthorized: Token expired" });
      return;
    }
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
