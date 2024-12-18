import zod from "zod";

export const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
  fullName: zod.string().min(3),
  avatarUrl: zod.string().url().optional(),
});

export const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

export const courseSchema = zod.object({
  title: zod.string().min(3),
  description: zod.string().min(10),
  price: zod.number().min(100),
  thumbnailUrl: zod.string(),
});

export const updateCourseSchema = zod
  .object({
    id: zod.string(),
    title: zod.string().min(3).optional(),
    description: zod.string().min(10).optional(),
    price: zod.number().min(100).optional(),
    thumbnailUrl: zod.string().optional(),
  })
  .refine(
    (data) => data.title || data.description || data.price || data.thumbnailUrl, // Ensure at least one field is provided
    {
      message: "You must update at least one field", // Error message if validation fails
      path: [], // Global validation error, not tied to a specific field
    }
  );

export const sectionSchema = zod.object({
  title: zod.string().min(3),
  courseId: zod.string(),
});
