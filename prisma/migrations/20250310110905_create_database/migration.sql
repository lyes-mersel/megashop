-- CreateTable
CREATE TABLE `admin` (
    `user_id` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adresse` (
    `id` VARCHAR(25) NOT NULL,
    `rue` VARCHAR(255) NULL,
    `ville` VARCHAR(100) NULL,
    `code_postal` VARCHAR(20) NULL,
    `pays` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorie` (
    `id` VARCHAR(25) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,

    UNIQUE INDEX `nom`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client` (
    `id` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commande` (
    `id` VARCHAR(25) NOT NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `montant` DECIMAL(10, 2) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'EXPEDIEE', 'LIVREE', 'ANNULEE') NULL DEFAULT 'EN_ATTENTE',
    `adresse_id` VARCHAR(25) NULL,
    `panier_id` VARCHAR(25) NULL,
    `client_id` VARCHAR(25) NULL,

    INDEX `index_adresse_id`(`adresse_id`),
    INDEX `index_client_id`(`client_id`),
    INDEX `index_panier_id`(`panier_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluation` (
    `id` VARCHAR(25) NOT NULL,
    `note` DECIMAL(2, 1) NOT NULL,
    `text` VARCHAR(500) NOT NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` VARCHAR(25) NULL,
    `produit_id` VARCHAR(25) NULL,

    INDEX `index_produit_id`(`produit_id`),
    INDEX `index_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filtre` (
    `id` VARCHAR(25) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `valeur` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filtre_produit` (
    `filtre_id` VARCHAR(25) NOT NULL,
    `produit_id` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`filtre_id`, `produit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ligne_commande` (
    `id` VARCHAR(25) NOT NULL,
    `commande_id` VARCHAR(25) NULL,
    `produit_id` VARCHAR(25) NULL,
    `nom_produit` VARCHAR(100) NULL,
    `quantite` INTEGER NOT NULL,
    `prix_unit` DECIMAL(10, 2) NOT NULL,

    INDEX `index_commande_id`(`commande_id`),
    INDEX `index_produit_id`(`produit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ligne_panier` (
    `panier_id` VARCHAR(25) NOT NULL,
    `produit_id` VARCHAR(25) NOT NULL,
    `quantite` INTEGER NOT NULL,

    PRIMARY KEY (`panier_id`, `produit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(25) NOT NULL,
    `objet` VARCHAR(255) NULL,
    `text` VARCHAR(1000) NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `url_redirection` VARCHAR(255) NULL,
    `est_lu` BOOLEAN NULL DEFAULT false,
    `user_id` VARCHAR(25) NULL,

    INDEX `index_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paiement_commande` (
    `id` VARCHAR(25) NOT NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `statut` ENUM('EN_ATTENTE', 'VALIDE', 'ECHOUE') NULL DEFAULT 'EN_ATTENTE',
    `commande_id` VARCHAR(25) NULL,

    INDEX `index_commande_id`(`commande_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paiement_vendeur` (
    `id` VARCHAR(25) NOT NULL,
    `montant` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `statut` ENUM('EN_ATTENTE', 'VALIDE', 'ECHOUE') NULL DEFAULT 'EN_ATTENTE',
    `vendeur_id` VARCHAR(25) NULL,

    INDEX `index_vendeur_id`(`vendeur_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `panier` (
    `id` VARCHAR(25) NOT NULL,
    `statut` ENUM('EN_COURS', 'VALIDE', 'ANNULE') NULL DEFAULT 'EN_COURS',
    `date_creation` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_modification` DATETIME(0) NULL,
    `user_id` VARCHAR(25) NULL,

    INDEX `index_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produit` (
    `id` VARCHAR(25) NOT NULL,
    `titre` VARCHAR(100) NOT NULL,
    `objet` VARCHAR(255) NULL,
    `description` VARCHAR(1000) NULL,
    `prix` DECIMAL(10, 2) NOT NULL,
    `qte_stock` INTEGER NOT NULL,
    `note_moyenne` DECIMAL(2, 1) NULL DEFAULT 0.0,
    `total_notations` INTEGER NULL DEFAULT 0,
    `image_url` VARCHAR(255) NULL,
    `date_creation` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `date_modification` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `categorie_id` VARCHAR(25) NULL,

    INDEX `index_categorie_id`(`categorie_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produit_boutique` (
    `produit_id` VARCHAR(25) NOT NULL,
    `fournisseur` VARCHAR(255) NULL,

    PRIMARY KEY (`produit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produit_marketplace` (
    `produit_id` VARCHAR(25) NOT NULL,
    `vendeur_id` VARCHAR(25) NOT NULL,

    INDEX `index_vendeur_id`(`vendeur_id`),
    PRIMARY KEY (`produit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reponse_evaluation` (
    `id` VARCHAR(25) NOT NULL,
    `text` VARCHAR(500) NOT NULL,
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` VARCHAR(25) NOT NULL,
    `evaluation_id` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `signalement` (
    `id` VARCHAR(25) NOT NULL,
    `objet` VARCHAR(255) NULL,
    `text` VARCHAR(1000) NULL,
    `statut` ENUM('EN_ATTENTE', 'TRAITE', 'REJETE') NULL DEFAULT 'EN_ATTENTE',
    `date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `client_id` VARCHAR(25) NULL,
    `produit_id` VARCHAR(25) NULL,

    INDEX `index_client_id`(`client_id`),
    INDEX `index_produit_id`(`produit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(25) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nom` VARCHAR(100) NULL,
    `prenom` VARCHAR(100) NULL,
    `tel` VARCHAR(20) NULL,
    `adresse_id` VARCHAR(25) NULL,
    `url_image` VARCHAR(255) NULL,
    `email_verifie` BOOLEAN NULL DEFAULT false,
    `date_creation` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `role` ENUM('CLIENT', 'VENDEUR', 'ADMIN') NOT NULL DEFAULT 'CLIENT',

    UNIQUE INDEX `unique_email`(`email`),
    INDEX `index_adresse_id`(`adresse_id`),
    INDEX `index_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendeur` (
    `id` VARCHAR(25) NOT NULL,
    `nom_affichage` VARCHAR(100) NULL,
    `rib` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `admin_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `client` ADD CONSTRAINT `client_id_fkey` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `commande` ADD CONSTRAINT `commande_adresse_id_fkey` FOREIGN KEY (`adresse_id`) REFERENCES `adresse`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `commande` ADD CONSTRAINT `commande_panier_id_fkey` FOREIGN KEY (`panier_id`) REFERENCES `panier`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `commande` ADD CONSTRAINT `commande_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluation` ADD CONSTRAINT `evaluation_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `filtre_produit` ADD CONSTRAINT `filtre_produit_filtre_id_fkey` FOREIGN KEY (`filtre_id`) REFERENCES `filtre`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `filtre_produit` ADD CONSTRAINT `filtre_produit_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commande`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_commande` ADD CONSTRAINT `ligne_commande_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_panier_id_fkey` FOREIGN KEY (`panier_id`) REFERENCES `panier`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ligne_panier` ADD CONSTRAINT `ligne_panier_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `paiement_commande` ADD CONSTRAINT `paiement_commande_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commande`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `paiement_vendeur` ADD CONSTRAINT `paiement_vendeur_vendeur_id_fkey` FOREIGN KEY (`vendeur_id`) REFERENCES `vendeur`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `panier` ADD CONSTRAINT `panier_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produit` ADD CONSTRAINT `produit_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categorie`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produit_boutique` ADD CONSTRAINT `produit_boutique_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produit_marketplace` ADD CONSTRAINT `produit_marketplace_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `produit_marketplace` ADD CONSTRAINT `produit_marketplace_vendeur_id_fkey` FOREIGN KEY (`vendeur_id`) REFERENCES `vendeur`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reponse_evaluation` ADD CONSTRAINT `reponse_evaluation_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reponse_evaluation` ADD CONSTRAINT `reponse_evaluation_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluation`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `signalement` ADD CONSTRAINT `signalement_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `signalement` ADD CONSTRAINT `signalement_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_adresse_id_fkey` FOREIGN KEY (`adresse_id`) REFERENCES `adresse`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `vendeur` ADD CONSTRAINT `vendeur_id_fkey` FOREIGN KEY (`id`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
