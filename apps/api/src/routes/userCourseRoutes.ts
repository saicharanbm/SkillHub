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

// when user clicks on the buy button we fetch the course price and verify if the user has already tried or purchased the course
// if the user has already bought the course we return an error
//if user had tried but failed delete the record and create a new order
// if the user has not tried or purchased the course we create an order
//store the order id in the user courses table
userCourseRouter.post("/:id/create-order", async (req, res) => {
  const courseId = req.params.id as string;
  const userId = req.userId as string;

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
      notes: {
        userId,
        courseId,
      },
    };
    // verify if there user had already tried or purchased the course
    const userCourse = await client.userCourses.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    if (userCourse && userCourse.status === "SUCCESS") {
      res
        .status(400)
        .json({ message: "User has already purchased this course" });
      return;
    }

    if (
      userCourse &&
      (userCourse.status === "FAILED" || userCourse.status === "PENDING")
    ) {
      // delete the previous order and create a new one
      await client.userCourses.delete({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
    }

    const order = await razorpayInstance.orders.create(options);

    // create a user course entry with order id user and course id and status pending
    await client.userCourses.create({
      data: {
        razorpayOrderId: order.id,
        userId,
        courseId,
        status: "PENDING",
        amount: course.price,
      },
    });
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

// verification of the payments should be done throught webhooks
// since we are sre not using the real money here, we are reliing on the frontend
// to send back the payment details
userCourseRouter.post("/:id/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ success: false, message: "Invalid input" });
    return;
  }
  console.log(req.body);

  const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
  if (!key_secret) {
    res
      .status(500)
      .json({ success: false, message: "Server configuration error" });
    return;
  }
  try {
    // check if the there is an order with the given order id in user courses table
    const userCourse = await client.userCourses.findUnique({
      where: {
        razorpayOrderId: razorpay_order_id,
      },
    });
    if (!userCourse) {
      res
        .status(404)
        .json({ success: false, message: "Order not found Please try again" });
      return;
    }
    //check if the user requesting the payment is the same as the one who created the order
    if (userCourse.userId !== req.userId) {
      res.status(403).json({ success: false, message: "Unauthorized access" });
      return;
    }
    //verify the razorpay signature
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      //update the user course status to success
      await client.userCourses.update({
        where: {
          razorpayOrderId: razorpay_order_id,
        },
        data: {
          status: "SUCCESS",
          paymentId: razorpay_payment_id,
        },
      });
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {}
});

//get user purchased courses
userCourseRouter.get("/purchases", async (req, res) => {
  const userId = req.userId as string;

  try {
    const purchases = await client.userCourses.findMany({
      where: {
        userId,
        status: "SUCCESS",
      },
      include: {
        course: true,
      },
    });
    res.json(purchases);
  } catch (error) {
    console.error("Error getting purchases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
