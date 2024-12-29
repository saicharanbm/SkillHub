import {
  signupSchema,
  loginSchema,
  getCourseThumbnailUrlSchema,
  courseSchema,
  sectionSchema,
  getCourseSectionContentUrlSchema,
  addCourseSectionContentSchema,
} from "@repo/zod-schemas/types";
import { z } from "zod";

export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type createSectionType = z.infer<typeof sectionSchema>;
export type getSectionContentUrlType = z.infer<
  typeof getCourseSectionContentUrlSchema
>;

export type addCourseSectionContentSchemaType = z.infer<
  typeof addCourseSectionContentSchema
>;
export type getCourseThumbnailUrlSchemaType = z.infer<
  typeof getCourseThumbnailUrlSchema
>;
export type createCourseSchemaType = z.infer<typeof courseSchema>;
