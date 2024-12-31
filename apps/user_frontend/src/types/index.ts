import { signupSchema, loginSchema } from "@repo/zod-schemas/types";
import { z } from "zod";

export type signupSchemaType = z.infer<typeof signupSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}
