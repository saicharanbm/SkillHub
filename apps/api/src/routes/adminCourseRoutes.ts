import { Router } from "express";
export const adminCourseRouter = Router();

adminCourseRouter.post("", async (req, res) => {
  res.send("Admin Create Course route");
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
