import { Router } from "express";
export const userCourseRouter = Router();

userCourseRouter.get("", async (req, res) => {
  res.send("User Get Course route");
});

userCourseRouter.get("/:id", async (req, res) => {
  res.send("User Get Course route");
});
