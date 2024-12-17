import { Router } from "express";
import { adminCourseRouter } from "./adminCourseRoutes";
export const adminRouter = Router();

adminRouter.get("/signup", async (req, res) => {
  res.send("Admin Signup route");
});

adminRouter.get("/signin", async (req, res) => {
  res.send("Admin Signin route");
});

adminRouter.use("/course", adminCourseRouter);
