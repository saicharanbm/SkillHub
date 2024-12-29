/*
  Warnings:

  - You are about to drop the column `order` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Section` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,sectionId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "order";

-- CreateIndex
CREATE UNIQUE INDEX "Content_title_sectionId_key" ON "Content"("title", "sectionId");
