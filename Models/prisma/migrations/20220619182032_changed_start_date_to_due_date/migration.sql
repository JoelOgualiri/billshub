/*
  Warnings:

  - You are about to drop the column `start_date` on the `bills` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bills` DROP COLUMN `start_date`,
    ADD COLUMN `due_date` DATETIME(3) NULL,
    MODIFY `repeat` BOOLEAN NOT NULL DEFAULT false;
