import { Router } from "express";
import { userCourseRouter } from "./userCourseRoutes";
import { signupSchema, loginSchema } from "@repo/zod-schemas/types";
import { compare, hash } from "../Scrypt";
import client from "@repo/db/client";
import { generateToken } from "../utils";
import { TokenType } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyUserMiddleware } from "../middlewares/verifyUserMiddleware";
export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const response = signupSchema.safeParse(req.body);
  if (!response.success) {
    res.status(400).send("Please provide valid data");
    return;
  }

  const hashedPassword = await hash(response.data.password);
  const avatarUrl = response.data.avatarUrl
    ? response.data.avatarUrl
    : "https://m.media-amazon.com/images/G/02/CerberusPrimeVideo-FN38FSBD/adult-2.png";
  try {
    const user = await client.user.create({
      data: {
        email: response.data.email,
        password: hashedPassword,
        avatarUrl,
        fullName: response.data.fullName,
      },
    });
    res.json({ message: "User successfully registered" });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint error code
      res.status(409).send({ message: "Email already exists" });
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

userRouter.post("/signin", async (req, res) => {
  const response = loginSchema.safeParse(req.body);
  if (!response.success) {
    res.status(400).send("Please provide valid data");
    return;
  }
  //check if the user exists
  try {
    const user = await client.user.findUnique({
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

    if (!process.env.JWT_USER_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT_SECRET" });
      return;
    }

    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_USER_SECRET!
    );
    const refreshToken = generateToken(
      user.id,
      TokenType.REFRESH,
      process.env.JWT_USER_SECRET!
    );
    // set the referesh token as a cookie
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

userRouter.post("/get-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });
    return;
  }
  try {
    if (!process.env.JWT_USER_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT_SECRET" });
      return;
    }
    //decode the token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_USER_SECRET
    ) as JwtPayload;
    const userId = decodedToken.userId;
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
    });
    //if user is not present revoke the refresh token and send 401
    if (!user) {
      res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_USER_SECRET
    );
    res.json({
      message: "token generated successfully",
      token: accessToken,
    });
  } catch (error: any) {
    console.log("get-token error: ", error);
    if (error.code === "P2024") {
      res
        .status(500)
        .json({ message: "Internal Server Error: User not found" });
      return;
    }
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

userRouter.get("/user-data", verifyUserMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/signout", async (req, res) => {
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logout successful" });
});
userRouter.get("/purchases", verifyUserMiddleware, async (req, res) => {
  res.send("User Purchases route");
  const userId = req.userId;

  try {
    const purchases = await client.userCourses.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            thumbnailUrl: true,
            creator: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.use("/course", verifyUserMiddleware, userCourseRouter);
