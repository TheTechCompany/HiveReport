/*
  Warnings:

  - Added the required column `createdBy` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
