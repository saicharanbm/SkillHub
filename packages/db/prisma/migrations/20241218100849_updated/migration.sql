/*
  Warnings:

  - A unique constraint covering the columns `[title,creatorId]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_title_creatorId_key" ON "Course"("title", "creatorId");
