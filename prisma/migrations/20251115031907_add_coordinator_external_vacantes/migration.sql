-- DropForeignKey
ALTER TABLE `Vacante` DROP FOREIGN KEY `Vacante_companyId_fkey`;

-- DropIndex
DROP INDEX `Vacante_companyId_fkey` ON `Vacante`;

-- AlterTable
ALTER TABLE `Vacante` ADD COLUMN `createdByCoordinatorId` VARCHAR(191) NULL,
    ADD COLUMN `externalCompanyEmail` VARCHAR(191) NULL,
    ADD COLUMN `externalCompanyName` VARCHAR(191) NULL,
    ADD COLUMN `externalCompanyPhone` VARCHAR(191) NULL,
    ADD COLUMN `isExternal` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isImageOnly` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `companyId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Vacante` ADD CONSTRAINT `Vacante_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vacante` ADD CONSTRAINT `Vacante_createdByCoordinatorId_fkey` FOREIGN KEY (`createdByCoordinatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
