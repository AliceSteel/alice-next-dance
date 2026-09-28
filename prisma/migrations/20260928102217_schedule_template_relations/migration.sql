/*
  Warnings:

  - You are about to drop the column `teacher` on the `ScheduleTemplate` table. All the data in the column will be lost.
  - Added the required column `instructorSlug` to the `ScheduleTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduleTemplate" DROP COLUMN "teacher",
ADD COLUMN     "instructorSlug" TEXT NOT NULL,
ALTER COLUMN "timezone" SET DEFAULT 'Europe/Copenhagen';

-- CreateIndex
CREATE INDEX "ScheduleTemplate_effectiveFrom_effectiveTo_idx" ON "ScheduleTemplate"("effectiveFrom", "effectiveTo");

-- AddForeignKey
ALTER TABLE "ScheduleTemplate" ADD CONSTRAINT "ScheduleTemplate_classSlug_fkey" FOREIGN KEY ("classSlug") REFERENCES "Class"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTemplate" ADD CONSTRAINT "ScheduleTemplate_instructorSlug_fkey" FOREIGN KEY ("instructorSlug") REFERENCES "Instructor"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
