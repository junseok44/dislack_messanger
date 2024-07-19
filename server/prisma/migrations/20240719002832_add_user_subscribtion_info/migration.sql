-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastPaymentDate` DATETIME(3) NULL,
    ADD COLUMN `nextPaymentDate` DATETIME(3) NULL,
    ADD COLUMN `planId` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `subscriptionId` VARCHAR(191) NULL,
    ADD COLUMN `subscriptionStatus` VARCHAR(191) NOT NULL DEFAULT 'inactive';
