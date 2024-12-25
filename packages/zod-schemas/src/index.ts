import zod from "zod";

export const signupSchema = zod.object({
  email: zod.string().trim().email(),
  password: zod.string().trim().min(6),
  fullName: zod.string().trim().min(3),
  avatarUrl: zod.string().trim().url().optional(),
});

export const loginSchema = zod.object({
  email: zod.string().trim().email(),
  password: zod.string().trim().min(6),
});
export const getCourseThumbnailUrlSchema = zod.object({
  thumbnailType: zod.string().includes("image"),
  thumbnailSize: zod
    .number()
    .gte(0)
    .lte(5 * 1024 * 1024),
});

export const courseSchema = zod.object({
  title: zod.string().trim().min(3),
  description: zod.string().trim().min(10),
  price: zod.number().min(100),
  thumbnailUrl: zod.string().trim(),
});

export const updateCourseSchema = zod
  .object({
    id: zod.string().trim(),
    title: zod.string().trim().min(3).optional(),
    description: zod.string().trim().min(10).optional(),
    price: zod.number().min(100).optional(),
    thumbnailUrl: zod.string().trim().optional(),
  })
  .refine(
    (data) => data.title || data.description || data.price || data.thumbnailUrl, // Ensure at least one field is provided
    {
      message: "You must update at least one field", // Error message if validation fails
      path: [], // Global validation error, not tied to a specific field
    }
  );

export const sectionSchema = zod.object({
  title: zod.string().trim().min(3),
  courseId: zod.string().trim(),
});
