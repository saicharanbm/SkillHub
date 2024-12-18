import { Router } from "express";
import { adminCourseRouter } from "./adminCourseRoutes";
import { signupSchema, loginSchema } from "@repo/zod-schemas/types";
import { compare, hash } from "../Scrypt";
import client from "@repo/db/client";
import { generateToken } from "../utils";
import { TokenType } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
export const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const response = signupSchema.safeParse(req.body);
  if (!response.success) {
    res.status(400).send("Please provide valid data");
    return;
  }

  const hashedPassword = await hash(response.data.password);
  const avatarUrl = response.data.avatarUrl ? response.data.avatarUrl : "";
  try {
    const user = await client.admin.create({
      data: {
        email: response.data.email,
        password: hashedPassword,
        avatarUrl,
        fullName: response.data.fullName,
      },
    });
    res.json({ message: "Admin successfully registered" });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint error code
      res.status(409).send({ message: "Email already exists" });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

adminRouter.post("/signin", async (req, res) => {
  const response = loginSchema.safeParse(req.body);
  if (!response.success) {
    res.status(400).send("Please provide valid data");
    return;
  }
  //check if the user exists
  try {
    const user = await client.admin.findUnique({
      where: {
        email: response.data.email,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // check if the password is correct
    const isPasswordValid = await compare(
      response.data.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    //generate refresh and access tokens
    if (!process.env.JWT_ADMIN_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT_SECRET" });
      return;
    }

    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_ADMIN_SECRET
    );
    const refreshToken = generateToken(
      user.id,
      TokenType.REFRESH,
      process.env.JWT_ADMIN_SECRET
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.json({ token: accessToken, message: "User successfully signed in" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

adminRouter.post("/get-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });
    return;
  }
  try {
    if (!process.env.JWT_ADMIN_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT_SECRET" });
      return;
    }
    //decode the token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_ADMIN_SECRET
    ) as JwtPayload;
    const userId = decodedToken.userId;
    const user = await client.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_ADMIN_SECRET
    );

    res.json({ token: accessToken, message: "token successfully generated" });
  } catch (error: any) {
    res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Unauthorized: Refresh token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Unauthorized: Invalid refresh token" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

adminRouter.post("/signout", async (req, res) => {
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logout successful" });
});
adminRouter.use("/course", adminCourseRouter);
