import { Router } from "express";
import { verifyAdminMiddleware } from "../middlewares/verifyAdminMiddleware";
import {
  getCourseThumbnailUrlSchema,
  courseSchema,
} from "@repo/zod-schemas/types";
import { getSecureUrl, moveFile } from "../utils/s3";
import client from "@repo/db/client";
import { uuid } from "../utils";
export const adminCourseRouter = Router();

adminCourseRouter.post("/", async (req, res) => {
  const data = { ...req.body, price: parseInt(req.body.price, 10) };
  console.log("adminCourseRouter post :", data);
  const response = courseSchema.safeParse(data);
  if (!response.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized: User not found" });
    return;
  }

  try {
    const { title, description, price, thumbnailUrl } = response.data;

    // Create the course with the provided temp url for the thumbnail
    const course = await client.course.create({
      data: {
        title,
        description,
        price,
        thumbnailUrl,
        creatorId: req.userId,
      },
    });

    // Now, move the thumbnail to the correct path
    try {
      // Move the thumbnail to the new path (course/userid/courseid/thumbnail)
      const destination = `course/admin/${req.userId}/${course.id}/thumbnail/${uuid()}`;
      await moveFile(thumbnailUrl, destination);

      // If the move is successful, update the course with the new thumbnail URL
      const updatedCourse = await client.course.update({
        where: { id: course.id },
        data: { thumbnailUrl: destination },
      });

      res.json(updatedCourse);
    } catch (error) {
      console.log("Error moving file:", error);

      // Delete the course if the file move fails to prevent storing the wrong data.
      await client.course.delete({
        where: { id: course.id },
      });

      res
        .status(500)
        .json({ message: "Internal server error: File move failed" });
    }
  } catch (error: any) {
    console.log("Error creating course:", error);
    if (error.code === "P2002") {
      // Prisma unique constraint error code
      res.status(409).json({ message: "Course already exists" });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal server error: Course creation failed" });
  }
});

//get signed url to upload course thumbnail
adminCourseRouter.post("/signed-thumbnail-url", async (req, res) => {
  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized: User not found" });
    return;
  }
  const request = getCourseThumbnailUrlSchema.safeParse(req.body);
  console.log("signed-thumbnail-url :", req.body);
  if (!request.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  try {
    const { thumbnailType, thumbnailSize } = request.data;
    const signedUrl = await getSecureUrl(
      "admin",
      req.userId,
      "thumbnail",
      thumbnailType,
      thumbnailSize
    );
    res.json(signedUrl);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

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
