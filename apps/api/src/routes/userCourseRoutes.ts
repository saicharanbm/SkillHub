import { Router } from "express";
export const userCourseRouter = Router();
import client from "@repo/db/client";

userCourseRouter.get("/", async (req, res) => {
  try {
    // Parse limit and cursor from query parameters
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const cursor = req.query.cursor as string;

    // Ensure userId is available
    if (!req.userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Initialize courses array
    let courses;
    if (!cursor || parseInt(cursor, 10) === 0) {
      // Fetch the first page of courses
      courses = await client.course.findMany({
        take: limit,
        orderBy: { id: "desc" },
      });
    } else {
      console.log("cursor is not null");
      // Fetch subsequent pages of courses using the cursor
      courses = await client.course.findMany({
        take: limit,
        cursor: { id: cursor },
        skip: 1, // Skip the cursor item itself
        orderBy: { id: "desc" },
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

userCourseRouter.get("/:id", async (req, res) => {
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
