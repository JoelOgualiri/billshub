-- AlterTable
ALTER TABLE `bills` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `end_date` DATETIME(3) NULL,
    ADD COLUMN `settled` BOOLEAN NOT NULL DEFAULT false;
