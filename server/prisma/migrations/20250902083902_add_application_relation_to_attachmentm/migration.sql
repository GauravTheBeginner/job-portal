/*
  Warnings:

  - You are about to drop the column `resume` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `resume` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Application` DROP COLUMN `resume`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `resume`;
