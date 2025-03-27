/*
  Warnings:

  - You are about to drop the column `image_url` on the `produit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `produit` DROP COLUMN `image_url`;

-- CreateTable
CREATE TABLE `produit_image` (
    `id` VARCHAR(25) NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `produit_id` VARCHAR(25) NOT NULL,

    INDEX `index_produit_id`(`produit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produit_image` ADD CONSTRAINT `produit_image_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
