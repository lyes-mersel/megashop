-- AlterTable
ALTER TABLE `produit` ADD COLUMN `genre_id` VARCHAR(25) NULL;

-- CreateTable
CREATE TABLE `genre` (
    `id` VARCHAR(25) NOT NULL,
    `nom` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `genre_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produit` ADD CONSTRAINT `produit_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
