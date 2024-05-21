/*
  Warnings:

  - Made the column `ratings` on table `post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "post" ALTER COLUMN "ratings" SET NOT NULL,
ALTER COLUMN "ratings" SET DEFAULT 0;
