-- AlterTable
ALTER TABLE `Application` ADD COLUMN `resume` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Attachment` ADD COLUMN `applicationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `resume` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
