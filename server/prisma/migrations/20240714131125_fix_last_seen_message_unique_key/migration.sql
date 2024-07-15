/*
  Warnings:

  - A unique constraint covering the columns `[userId,channelId]` on the table `LastSeenMessageOnChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `LastSeenMessageOnChannel` MODIFY `messageId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LastSeenMessageOnChannel_userId_channelId_key` ON `LastSeenMessageOnChannel`(`userId`, `channelId`);
