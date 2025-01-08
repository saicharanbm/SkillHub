import { Router } from "express";
import { adminRouter } from "./adminRoutes";
import { userRouter } from "./userRoutes";
import { connectToKafkaProducer } from "../utils/producer";
export const router = Router();

connectToKafkaProducer();
router.use("/admin", adminRouter);
router.use("/user", userRouter);
