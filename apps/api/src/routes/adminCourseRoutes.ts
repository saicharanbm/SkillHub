import { Router } from "express";
import { verifyAdminMiddleware } from "../middlewares/verifyAdminMiddleware";
import { getCourseAvatarUrlSchema } from "@repo/zod-schemas/types";
import { getSecureUrl } from "../utils/s3";
export const adminCourseRouter = Router();

adminCourseRouter.post("/", async (req, res) => {
  res.send("Admin Create Course route");
});

//get signed url to upload course avatar
adminCourseRouter.post(
  "/signed-avatar-url",
  verifyAdminMiddleware,
  async (req, res) => {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const request = getCourseAvatarUrlSchema.safeParse(req.body);
    if (!request.success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }
    try {
      const { avatarName, avatarType, avatarSize } = request.data;
      const signedUrl = await getSecureUrl(avatarName, avatarType, avatarSize);
      res.json(signedUrl);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

adminCourseRouter.put("/:id", async (req, res) => {
  res.send("Admin Update Course route");
});
//add new sections to the course

adminCourseRouter.post("/:id/section", async (req, res) => {
  res.send("Admin Add Section to Course route");
});

adminCourseRouter.put("/:id/section/:sectionId", async (req, res) => {
  res.send("Admin Update Section of Course route");
});

adminCourseRouter.delete("/:id/section/:sectionId", async (req, res) => {
  res.send("Admin Delete Section of Course route");
});

//add content to the sections of the course

adminCourseRouter.post("/:id/section/:sectionId/content", async (req, res) => {
  res.send("Admin Add Content to Section of Course route");
});

adminCourseRouter.put(
  "/:id/section/:sectionId/content/:contentId",
  async (req, res) => {
    res.send("Admin Update Content of Section of Course route");
  }
);

adminCourseRouter.delete("/:id", async (req, res) => {
  res.send("Admin Delete Course route");
});
