-- DropForeignKey
ALTER TABLE `LastSeenMessageOnChannel` DROP FOREIGN KEY `LastSeenMessageOnChannel_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `LastSeenMessageOnChannel` DROP FOREIGN KEY `LastSeenMessageOnChannel_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_channelId_fkey`;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LastSeenMessageOnChannel` ADD CONSTRAINT `LastSeenMessageOnChannel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LastSeenMessageOnChannel` ADD CONSTRAINT `LastSeenMessageOnChannel_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
