-- AlterTable
ALTER TABLE `Application` ADD COLUMN `cvViewed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hiredAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `career` VARCHAR(191) NULL,
    ADD COLUMN `period` INTEGER NULL;

-- AlterTable
ALTER TABLE `Vacante` ADD COLUMN `benefits` TEXT NULL,
    ADD COLUMN `originalDeadline` DATETIME(3) NULL,
    ADD COLUMN `requirements` TEXT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    MODIFY `summary` TEXT NOT NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `responsibilities` TEXT NOT NULL,
    MODIFY `applicationProcess` TEXT NULL;

-- AlterTable
ALTER TABLE `company` ADD COLUMN `approvalStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `fiscalDocumentUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `location` VARCHAR(191) NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `maxAttendees` INTEGER NULL,
    `registrationUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `companyId` VARCHAR(191) NOT NULL,
    `stateId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Event_companyId_idx`(`companyId`),
    INDEX `Event_startDate_idx`(`startDate`),
    INDEX `Event_eventType_idx`(`eventType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Survey` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `daysAfterHiring` INTEGER NOT NULL DEFAULT 30,
    `surveyDuration` INTEGER NOT NULL DEFAULT 30,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `surveyId` VARCHAR(191) NOT NULL,
    `question` TEXT NOT NULL,
    `order` INTEGER NOT NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SurveyQuestion_surveyId_idx`(`surveyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyResponse` (
    `id` VARCHAR(191) NOT NULL,
    `surveyId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `comments` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SurveyResponse_surveyId_idx`(`surveyId`),
    INDEX `SurveyResponse_companyId_idx`(`companyId`),
    INDEX `SurveyResponse_studentId_idx`(`studentId`),
    UNIQUE INDEX `SurveyResponse_surveyId_companyId_studentId_key`(`surveyId`, `companyId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `responseId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SurveyAnswer_responseId_idx`(`responseId`),
    INDEX `SurveyAnswer_questionId_idx`(`questionId`),
    UNIQUE INDEX `SurveyAnswer_responseId_questionId_key`(`responseId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserJobExperience` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `initialDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `jobRole` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_stateId_fkey` FOREIGN KEY (`stateId`) REFERENCES `State`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyQuestion` ADD CONSTRAINT `SurveyQuestion_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyResponse` ADD CONSTRAINT `SurveyResponse_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyResponse` ADD CONSTRAINT `SurveyResponse_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyResponse` ADD CONSTRAINT `SurveyResponse_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswer` ADD CONSTRAINT `SurveyAnswer_responseId_fkey` FOREIGN KEY (`responseId`) REFERENCES `SurveyResponse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswer` ADD CONSTRAINT `SurveyAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `SurveyQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJobExperience` ADD CONSTRAINT `UserJobExperience_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
