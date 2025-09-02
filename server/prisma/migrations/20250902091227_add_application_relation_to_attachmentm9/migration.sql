/*
  Warnings:

  - You are about to drop the column `userId` on the `Job` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Job` DROP FOREIGN KEY `Job_userId_fkey`;

-- DropIndex
DROP INDEX `Job_userId_fkey` ON `Job`;

-- AlterTable
ALTER TABLE `Job` DROP COLUMN `userId`,
    ADD COLUMN `salary` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;
