-- AlterTable
ALTER TABLE `Event` ADD COLUMN `coordinatorId` VARCHAR(191) NULL,
    MODIFY `companyId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Event_coordinatorId_idx` ON `Event`(`coordinatorId`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_coordinatorId_fkey` FOREIGN KEY (`coordinatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
