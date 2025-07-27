-- Add new fields to Vacante table
ALTER TABLE `Vacante` ADD COLUMN `originalDeadline` DATETIME(3) NULL;
ALTER TABLE `Vacante` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active';
ALTER TABLE `Vacante` ADD COLUMN `requirements` TEXT NULL;
ALTER TABLE `Vacante` ADD COLUMN `benefits` TEXT NULL;

-- Update existing records to have active status
UPDATE `Vacante` SET `status` = 'active' WHERE `status` IS NULL;