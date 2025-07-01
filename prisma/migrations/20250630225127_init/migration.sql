-- CreateTable
CREATE TABLE `Vacante` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `responsibilities` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `salaryMin` INTEGER NULL,
    `salaryMax` INTEGER NULL,
    `department` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `modality` VARCHAR(191) NULL,
    `requirements` VARCHAR(191) NULL,
    `benefits` VARCHAR(191) NULL,
    `experienceLevel` VARCHAR(191) NULL,
    `numberOfPositions` INTEGER NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `isMock` BOOLEAN NOT NULL DEFAULT false,
    `applicationProcess` VARCHAR(191) NULL,
    `deadline` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_VacanteApplicants` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_VacanteApplicants_AB_unique`(`A`, `B`),
    INDEX `_VacanteApplicants_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vacante` ADD CONSTRAINT `Vacante_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VacanteApplicants` ADD CONSTRAINT `_VacanteApplicants_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_VacanteApplicants` ADD CONSTRAINT `_VacanteApplicants_B_fkey` FOREIGN KEY (`B`) REFERENCES `Vacante`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
