-- AlterTable
ALTER TABLE `Event` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `eventType` VARCHAR(191) NULL,
    MODIFY `startDate` DATETIME(3) NULL;
