-- CreateTable
CREATE TABLE `bills` (
    `due_date` DATETIME(3) NULL,
    `amount` VARCHAR(45) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `reminder_length` INTEGER NULL,
    `reoccuring` BOOLEAN NOT NULL DEFAULT true,

    INDEX `bills_customerId_fkey`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `username` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(45) NOT NULL,
    `lastname` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `signup_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `updatedAt` DATETIME(3) NOT NULL,
    `hashed_password` VARCHAR(128) NOT NULL,
    `salt` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `customer_username_key`(`username`),
    UNIQUE INDEX `customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bills` ADD CONSTRAINT `bills_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
