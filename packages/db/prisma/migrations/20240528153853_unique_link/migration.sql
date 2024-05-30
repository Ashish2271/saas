/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "post_link_key" ON "post"("link");
