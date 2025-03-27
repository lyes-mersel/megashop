/*
  Warnings:

  - You are about to drop the `filtre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filtre_ligne_commande` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filtre_ligne_panier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filtre_produit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `filtre_ligne_commande` DROP FOREIGN KEY `filtre_ligne_commande_filtre_id_fkey`;

-- DropForeignKey
ALTER TABLE `filtre_ligne_commande` DROP FOREIGN KEY `filtre_ligne_commande_ligne_commande_id_fkey`;

-- DropForeignKey
ALTER TABLE `filtre_ligne_panier` DROP FOREIGN KEY `filtre_ligne_panier_filtre_id_fkey`;

-- DropForeignKey
ALTER TABLE `filtre_ligne_panier` DROP FOREIGN KEY `filtre_ligne_panier_ligne_panier_id_fkey`;

-- DropForeignKey
ALTER TABLE `filtre_produit` DROP FOREIGN KEY `filtre_produit_filtre_id_fkey`;

-- DropForeignKey
ALTER TABLE `filtre_produit` DROP FOREIGN KEY `filtre_produit_produit_id_fkey`;

-- AlterTable
ALTER TABLE `ligne_commande` ADD COLUMN `couleur_id` VARCHAR(25) NULL,
    ADD COLUMN `taille_id` VARCHAR(25) NULL;

-- AlterTable
ALTER TABLE `ligne_panier` ADD COLUMN `couleur_id` VARCHAR(25) NULL,
    ADD COLUMN `taille_id` VARCHAR(25) NULL;

-- DropTable
DROP TABLE `filtre`;

-- DropTable
DROP TABLE `filtre_ligne_commande`;

-- DropTable
DROP TABLE `filtre_ligne_panier`;

-- DropTable
DROP TABLE `filtre_produit`;

-- CreateTable
CREATE TABLE `couleur` (
    `id` VARCHAR(25) NOT NULL,
    `nom` VARCHAR(50) NOT NULL,
    `code` CHAR(7) NOT NULL,

    UNIQUE INDEX `couleur_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taille` (
    `id` VARCHAR(25) NOT NULL,
    `nom` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `taille_nom_key`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProduitCouleurs` (
    `A` VARCHAR(25) NOT NULL,
    `B` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `_ProduitCouleurs_AB_unique`(`A`, `B`),
    INDEX `_ProduitCouleurs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProduitTailles` (
    `A` VARCHAR(25) NOT NULL,
    `B` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `_ProduitTailles_AB_unique`(`A`, `B`),
    INDEX `_ProduitTailles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_couleur_id_fkey` FOREIGN KEY (`couleur_id`) REFERENCES `couleur`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_taille_id_fkey` FOREIGN KEY (`taille_id`) REFERENCES `taille`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_couleur_id_fkey` FOREIGN KEY (`couleur_id`) REFERENCES `couleur`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_taille_id_fkey` FOREIGN KEY (`taille_id`) REFERENCES `taille`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_ProduitCouleurs` ADD CONSTRAINT `_ProduitCouleurs_A_fkey` FOREIGN KEY (`A`) REFERENCES `couleur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProduitCouleurs` ADD CONSTRAINT `_ProduitCouleurs_B_fkey` FOREIGN KEY (`B`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProduitTailles` ADD CONSTRAINT `_ProduitTailles_A_fkey` FOREIGN KEY (`A`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProduitTailles` ADD CONSTRAINT `_ProduitTailles_B_fkey` FOREIGN KEY (`B`) REFERENCES `taille`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
