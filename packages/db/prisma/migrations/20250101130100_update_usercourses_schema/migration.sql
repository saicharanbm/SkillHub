/*
  Warnings:

  - Added the required column `updatedAt` to the `UserCourses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserCourses" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL,
ALTER COLUMN "enrolledAt" SET DEFAULT CURRENT_TIMESTAMP;
