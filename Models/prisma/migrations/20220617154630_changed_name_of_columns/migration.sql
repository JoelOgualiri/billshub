/*
  Warnings:

  - You are about to drop the column `due_date` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `reminder_length` on the `bills` table. All the data in the column will be lost.
  - You are about to drop the column `reoccuring` on the `bills` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bills` DROP COLUMN `due_date`,
    DROP COLUMN `reminder_length`,
    DROP COLUMN `reoccuring`,
    ADD COLUMN `alert` INTEGER NULL,
    ADD COLUMN `repeat` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `start_date` DATETIME(3) NULL;
