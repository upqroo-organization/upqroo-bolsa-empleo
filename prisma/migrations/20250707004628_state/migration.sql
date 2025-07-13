/*
  Warnings:

  - You are about to drop the column `state` on the `company` table. All the data in the column will be lost.
  - Made the column `email` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roleId` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `company_roleId_fkey`;

-- DropIndex
DROP INDEX `company_roleId_fkey` ON `company`;

-- AlterTable
ALTER TABLE `Vacante` ADD COLUMN `stateId` INTEGER NULL;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `state`,
    ADD COLUMN `stateId` INTEGER NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `roleId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `State` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacante` ADD CONSTRAINT `Vacante_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
