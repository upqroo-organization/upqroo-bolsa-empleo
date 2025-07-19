-- AlterTable
ALTER TABLE `User` ADD COLUMN `cvUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Application` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `vacanteId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Application_userId_idx`(`userId`),
    INDEX `Application_vacanteId_idx`(`vacanteId`),
    UNIQUE INDEX `Application_userId_vacanteId_key`(`userId`, `vacanteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_vacanteId_fkey` FOREIGN KEY (`vacanteId`) REFERENCES `Vacante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
