import {
  signupSchema,
  loginSchema,
  getCourseThumbnailUrlSchema,
  courseSchema,
} from "@repo/zod-schemas/types";
import { z } from "zod";

export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type getCourseThumbnailUrlSchemaType = z.infer<
  typeof getCourseThumbnailUrlSchema
>;
export type createCourseSchemaType = z.infer<typeof courseSchema>;
