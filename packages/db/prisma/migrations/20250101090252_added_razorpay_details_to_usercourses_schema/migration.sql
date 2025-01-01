/*
  Warnings:

  - A unique constraint covering the columns `[razorpayOrderId]` on the table `UserCourses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `UserCourses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpayOrderId` to the `UserCourses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "UserCourses" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "razorpayOrderId" TEXT NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "enrolledAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "UserCourses_razorpayOrderId_key" ON "UserCourses"("razorpayOrderId");
