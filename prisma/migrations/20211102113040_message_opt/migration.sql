/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "messages_user_id_key" ON "messages"("user_id");
