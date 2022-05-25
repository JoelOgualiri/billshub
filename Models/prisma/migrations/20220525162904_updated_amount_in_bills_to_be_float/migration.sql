/*
  Warnings:

  - You are about to alter the column `amount` on the `bills` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Double`.

*/
-- AlterTable
ALTER TABLE `bills` MODIFY `amount` DOUBLE NOT NULL;
