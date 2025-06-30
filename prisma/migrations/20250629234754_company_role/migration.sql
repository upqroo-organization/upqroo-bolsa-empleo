-- AlterTable
ALTER TABLE `company` ADD COLUMN `isApprove` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `roleId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
