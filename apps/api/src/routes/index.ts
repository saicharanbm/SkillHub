import { Router } from "express";
import { adminRouter } from "./adminRoutes";
import { userRouter } from "./userRoutes";
export const router = Router();

router.use("/admin", adminRouter);
router.use("/user", userRouter);
