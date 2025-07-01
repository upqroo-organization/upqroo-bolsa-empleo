/*
  Warnings:

  - You are about to drop the column `benefits` on the `Vacante` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Vacante` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Vacante` DROP COLUMN `benefits`,
    DROP COLUMN `requirements`;
