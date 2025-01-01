import { Router } from "express";
export const userCourseRouter = Router();
import client from "@repo/db/client";
import { razorpayInstance } from "..";
import crypto from "crypto";

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
    const course = await client.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        creator: {
          select: {
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        sections: {
          include: {
            contents: true, // Include all contents for each section
          },
        },
      },
    });

    res.json(course);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    console.error("Error fetching course with sections and contents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userCourseRouter.post("/:id/create-order", async (req, res) => {
  const courseId = req.params.id;
  const userId = req.userId;

  try {
    const course = await client.course.findUniqueOrThrow({
      where: { id: courseId },
      select: {
        price: true,
      },
    });
    //now we create an order using razorpay
    const options = {
      amount: course.price, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpayInstance.orders.create(options);
    res.json({ order });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    console.error("Error creating order", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userCourseRouter.post("/:id/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  console.log(req.body);

  const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});
