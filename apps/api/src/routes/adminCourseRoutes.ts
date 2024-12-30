import { Router } from "express";
import {
  getCourseThumbnailUrlSchema,
  courseSchema,
  sectionSchema,
  getCourseSectionContentUrlSchema,
  addCourseSectionContentSchema,
} from "@repo/zod-schemas/types";
import { getSecureUrl, moveFile } from "../utils/s3";
import client from "@repo/db/client";
import { uuid } from "../utils";
export const adminCourseRouter = Router();

//get created courses
adminCourseRouter.get("/", async (req, res) => {
  try {
    console.log(req.query);
    // Parse limit and cursor from query parameters
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const cursor = req.query.cursor as string;
    // console.log(parseInt(req.userId, 10));

    // Ensure userId is available
    if (!req.userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Initialize courses array
    let courses;
    if (!cursor || parseInt(cursor, 10) === 0) {
      console.log("cursor is null");
      // Fetch the first page of courses
      courses = await client.course.findMany({
        where: {
          creatorId: req.userId,
        },
        take: limit,
        orderBy: { id: "asc" },
      });
    } else {
      console.log("cursor is not null");
      // Fetch subsequent pages of courses using the cursor
      courses = await client.course.findMany({
        where: {
          creatorId: req.userId,
        },
        take: limit,
        cursor: { id: cursor },
        skip: 1, // Skip the cursor item itself
        orderBy: { id: "asc" },
      });
    }

    // Determine the next cursor
    const nextCursor =
      courses.length > 0 ? courses[courses.length - 1].id : null;

    // Send response
    res.json({
      courses,
      nextCursor,
    });
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//crete course
adminCourseRouter.post("/", async (req, res) => {
  const data = { ...req.body, price: parseInt(req.body.price, 10) };
  console.log("adminCourseRouter post :", data);
  const response = courseSchema.safeParse(data);
  if (!response.success) {
    res.status(400).json({ message: "Invalid request body" });
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
        creatorId: req.userId!,
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

      res.json({
        message: "Course created successfully",
        courseId: updatedCourse.id,
      });
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
  const request = getCourseThumbnailUrlSchema.safeParse(req.body);
  console.log("signed-thumbnail-url :", req.body);
  if (!request.success) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }
  try {
    const { thumbnailType, thumbnailSize } = request.data;
    const signedUrl = await getSecureUrl("admin", thumbnailType, thumbnailSize);
    res.json(signedUrl);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// get specific course details
adminCourseRouter.get("/:id", async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await client.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            contents: true, // Include all contents for each section
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.creatorId !== req.userId) {
      res
        .status(401)
        .json({ message: "Unauthorized: You don't own this course" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course with sections and contents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//add new sections to the course
adminCourseRouter.post("/:id/section", async (req, res) => {
  try {
    const id = req.params.id;
    const request = sectionSchema.safeParse(req.body);
    if (!request.success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }
    const course = await client.course.findUnique({
      where: {
        id,
      },
    });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    if (course.creatorId !== req.userId) {
      res
        .status(401)
        .json({ message: "Unauthorized: You dont own this course" });
      return;
    }
    const section = await client.section.create({
      data: {
        title: req.body.title,
        courseId: id,
      },
    });

    res.json({ message: "Section added successfully" });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint error code
      res.status(409).json({ message: "Section already exists" });
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get signed url to upload content of the course section to s3
adminCourseRouter.post(
  "/:id/section/:sectionId/content/signed-url",
  async (req, res) => {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const { id, sectionId } = req.params;

    try {
      // Validate that the section belongs to the course
      const section = await client.section.findFirst({
        where: {
          id: sectionId,
          courseId: id,
        },
      });

      if (!section) {
        res.status(404).json({
          message: "Section not found or does not belong to the course.",
        });
        return;
      }

      // Validate course ownership
      const course = await client.course.findUnique({
        where: {
          id,
        },
      });

      if (!course) {
        res.status(404).json({
          message: "Course not found.",
        });
        return;
      }

      if (course.creatorId !== req.userId) {
        res
          .status(403)
          .json({ message: "Forbidden: You don't own this course." });
        return;
      }

      // Validate request body
      const request = getCourseSectionContentUrlSchema.safeParse(req.body);
      console.log("signed-course-section-content-body:", req.body);

      if (!request.success) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      // Generate signed URL
      const { contentType, contentSize } = request.data;

      const signedUrl = await getSecureUrl("admin", contentType, contentSize);
      res.json(signedUrl);
    } catch (error) {
      console.error("Error handling signed URL request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//add content to the section

adminCourseRouter.post("/:id/section/:sectionId/content", async (req, res) => {
  const { id, sectionId } = req.params;
  try {
    // Validate that the section belongs to the course
    const section = await client.section.findFirst({
      where: {
        id: sectionId,
        courseId: id,
      },
    });
    if (!section) {
      res.status(404).json({
        message: "Section not found or does not belong to the course.",
      });
      return;
    }

    // Validate course ownership
    const course = await client.course.findUnique({
      where: {
        id,
      },
    });

    if (!course) {
      res.status(404).json({
        message: "Course not found.",
      });
      return;
    }

    if (course.creatorId !== req.userId) {
      res
        .status(403)
        .json({ message: "Forbidden: You don't own this course." });
      return;
    }

    //validate request body
    const request = addCourseSectionContentSchema.safeParse(req.body);
    console.log("add-course-section-content-body:", req.body);
    if (!request.success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    // Add content with provided temp url and sectionId
    const content = await client.content.create({
      data: {
        title: request.data.title,
        description: request.data.description,
        url: request.data.contentUrl,
        sectionId: request.data.sectionId,
      },
    });

    // Now, move the thumbnail to the correct path
    try {
      // Move the thumbnail to the new path (course/userid/courseid/thumbnail)
      const destination = `course/admin/${req.userId}/${course.id}/${content.id}/${uuid()}`;
      await moveFile(request.data.contentUrl, destination);

      // If the move is successful, update the content with the new path
      const updatedContent = await client.content.update({
        where: { id: content.id },
        data: { url: destination },
      });

      res.json({
        message: "Content added successfully",
        content: updatedContent,
      });
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

//add content to the sections of the course

adminCourseRouter.put("/:id/section/:sectionId", async (req, res) => {
  res.send("Admin Update Section of Course route");
});

adminCourseRouter.delete("/:id/section/:sectionId", async (req, res) => {
  res.send("Admin Delete Section of Course route");
});

adminCourseRouter.put(
  "/:id/section/:sectionId/content/:contentId",
  async (req, res) => {
    res.send("Admin Update Content of Section of Course route");
  }
);

//delete contents from the s3 and then delete the course
adminCourseRouter.delete("/:id", async (req, res) => {
  res.send("Admin Delete Course route");
});
