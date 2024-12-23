import {
  signupSchema,
  loginSchema,
  getCourseAvatarUrlSchema,
} from "@repo/zod-schemas/types";
import { z } from "zod";

export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
export type getCourseAvatarUrlSchemaType = z.infer<
  typeof getCourseAvatarUrlSchema
>;
