import { Router } from "express";
import { userCourseRouter } from "./userCourseRoutes";
export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  res.send("User Signup route");
});

userRouter.post("/signin", async (req, res) => {
  res.send("User Signin route");
});

userRouter.get("/purchases", async (req, res) => {
  res.send("User Purchases route");
});

userRouter.use("/course", userCourseRouter);
