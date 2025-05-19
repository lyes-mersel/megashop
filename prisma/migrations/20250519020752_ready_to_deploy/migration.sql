-- CreateEnum
CREATE TYPE "PanierStatut" AS ENUM ('EN_COURS', 'VALIDE', 'ANNULE');

-- CreateEnum
CREATE TYPE "PaiementStatut" AS ENUM ('EN_ATTENTE', 'VALIDE', 'ECHOUE');

-- CreateEnum
CREATE TYPE "SignalementStatut" AS ENUM ('EN_ATTENTE', 'TRAITE', 'REJETE');

-- CreateEnum
CREATE TYPE "CommandeStatut" AS ENUM ('EN_ATTENTE', 'EXPEDIEE', 'LIVREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'VENDEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DEFAULT', 'COMMANDE', 'LIVRAISON', 'PAIEMENT', 'SIGNALEMENT', 'EVALUATION', 'MESSAGE', 'SECURITE');

-- CreateTable
CREATE TABLE "admin" (
    "user_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "adresse" (
    "id" VARCHAR(25) NOT NULL,
    "rue" VARCHAR(255) NOT NULL,
    "ville" VARCHAR(100) NOT NULL,
    "wilaya" VARCHAR(100) NOT NULL,
    "code_postal" VARCHAR(20) NOT NULL,

    CONSTRAINT "adresse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorie" (
    "id" VARCHAR(25) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couleur" (
    "id" VARCHAR(25) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "code" CHAR(7) NOT NULL,

    CONSTRAINT "couleur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" VARCHAR(25) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commande" (
    "id" VARCHAR(25) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DECIMAL(10,2) NOT NULL,
    "statut" "CommandeStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "adresse_id" VARCHAR(25),
    "panier_id" VARCHAR(25),
    "client_id" VARCHAR(25),
    "paiement_id" VARCHAR(25),

    CONSTRAINT "commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation" (
    "id" VARCHAR(25) NOT NULL,
    "note" DECIMAL(3,2) NOT NULL,
    "text" VARCHAR(500),
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" VARCHAR(25) NOT NULL,
    "produit_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" VARCHAR(25) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ligne_commande" (
    "id" VARCHAR(25) NOT NULL,
    "nom_produit" VARCHAR(100) NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unit" DECIMAL(10,2) NOT NULL,
    "image_public_id" VARCHAR(255),
    "commande_id" VARCHAR(25) NOT NULL,
    "produit_id" VARCHAR(25),
    "couleur_id" VARCHAR(25),
    "taille_id" VARCHAR(25),

    CONSTRAINT "ligne_commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ligne_panier" (
    "id" VARCHAR(25) NOT NULL,
    "nom_produit" VARCHAR(100) NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unit" DECIMAL(10,2) NOT NULL,
    "image_public_id" VARCHAR(255),
    "panier_id" VARCHAR(25) NOT NULL,
    "produit_id" VARCHAR(25),
    "couleur_id" VARCHAR(25),
    "taille_id" VARCHAR(25),

    CONSTRAINT "ligne_panier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" VARCHAR(25) NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'DEFAULT',
    "objet" VARCHAR(255) NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url_redirection" VARCHAR(255),
    "est_lu" BOOLEAN NOT NULL DEFAULT false,
    "user_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiement_commande" (
    "id" VARCHAR(25) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "PaiementStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "commande_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "paiement_commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiement_vendeur" (
    "id" VARCHAR(25) NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "statut" "PaiementStatut" DEFAULT 'EN_ATTENTE',
    "vendeur_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "paiement_vendeur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panier" (
    "id" VARCHAR(25) NOT NULL,
    "statut" "PanierStatut" DEFAULT 'EN_COURS',
    "date_creation" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(3),
    "user_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "panier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produit" (
    "id" VARCHAR(25) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "objet" VARCHAR(255),
    "description" VARCHAR(1000),
    "prix" DECIMAL(10,2) NOT NULL,
    "qte_stock" INTEGER NOT NULL,
    "note_moyenne" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    "total_evaluations" INTEGER NOT NULL DEFAULT 0,
    "date_creation" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modification" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categorie_id" VARCHAR(25),
    "genre_id" VARCHAR(25),

    CONSTRAINT "produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produit_image" (
    "id" VARCHAR(25) NOT NULL,
    "image_public_id" VARCHAR(255) NOT NULL,
    "produit_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "produit_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produit_boutique" (
    "produit_id" VARCHAR(25) NOT NULL,
    "fournisseur" VARCHAR(255),

    CONSTRAINT "produit_boutique_pkey" PRIMARY KEY ("produit_id")
);

-- CreateTable
CREATE TABLE "produit_marketplace" (
    "produit_id" VARCHAR(25) NOT NULL,
    "vendeur_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "produit_marketplace_pkey" PRIMARY KEY ("produit_id")
);

-- CreateTable
CREATE TABLE "reponse_evaluation" (
    "id" VARCHAR(25) NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" VARCHAR(25) NOT NULL,
    "evaluation_id" VARCHAR(25) NOT NULL,

    CONSTRAINT "reponse_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signalement" (
    "id" VARCHAR(25) NOT NULL,
    "objet" VARCHAR(255),
    "text" VARCHAR(1000),
    "statut" "SignalementStatut" DEFAULT 'EN_ATTENTE',
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "client_id" VARCHAR(25),
    "produit_id" VARCHAR(25),

    CONSTRAINT "signalement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taille" (
    "id" VARCHAR(25) NOT NULL,
    "nom" VARCHAR(10) NOT NULL,

    CONSTRAINT "taille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "totp_secret" (
    "id" VARCHAR(25) NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "secret" VARCHAR(64) NOT NULL,
    "exipre_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "totp_secret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(25) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "tel" VARCHAR(20),
    "adresse_id" VARCHAR(25),
    "image_public_id" VARCHAR(255),
    "email_en_attente" VARCHAR(255),
    "email_verifie" BOOLEAN NOT NULL DEFAULT false,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendeur" (
    "id" VARCHAR(25) NOT NULL,
    "nom_public" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000),
    "nom_banque" VARCHAR(50) NOT NULL,
    "rib" VARCHAR(50) NOT NULL,

    CONSTRAINT "vendeur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProduitCouleurs" (
    "A" VARCHAR(25) NOT NULL,
    "B" VARCHAR(25) NOT NULL,

    CONSTRAINT "_ProduitCouleurs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProduitTailles" (
    "A" VARCHAR(25) NOT NULL,
    "B" VARCHAR(25) NOT NULL,

    CONSTRAINT "_ProduitTailles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "nom" ON "categorie"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "couleur_nom_key" ON "couleur"("nom");

-- CreateIndex
CREATE INDEX "index_commande_client_id" ON "commande"("client_id");

-- CreateIndex
CREATE INDEX "index_commande_panier_id" ON "commande"("panier_id");

-- CreateIndex
CREATE INDEX "index_evaluation_produit_id" ON "evaluation"("produit_id");

-- CreateIndex
CREATE INDEX "index_evaluation_user_id" ON "evaluation"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "genre_nom_key" ON "genre"("nom");

-- CreateIndex
CREATE INDEX "index_ligne_commande_commande_id" ON "ligne_commande"("commande_id");

-- CreateIndex
CREATE INDEX "index_ligne_commande_produit_id" ON "ligne_commande"("produit_id");

-- CreateIndex
CREATE INDEX "index_ligne_panier_panier_id" ON "ligne_panier"("panier_id");

-- CreateIndex
CREATE INDEX "index_ligne_panier_produit_id" ON "ligne_panier"("produit_id");

-- CreateIndex
CREATE INDEX "index_notification_user_id" ON "notification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "paiement_commande_commande_id_key" ON "paiement_commande"("commande_id");

-- CreateIndex
CREATE INDEX "index_commande_id" ON "paiement_commande"("commande_id");

-- CreateIndex
CREATE INDEX "index_paiement_vendeur_vendeur_id" ON "paiement_vendeur"("vendeur_id");

-- CreateIndex
CREATE INDEX "index_panier_user_id" ON "panier"("user_id");

-- CreateIndex
CREATE INDEX "index_categorie_id" ON "produit"("categorie_id");

-- CreateIndex
CREATE INDEX "index_qte_stock" ON "produit"("qte_stock");

-- CreateIndex
CREATE INDEX "index_produit_image_produit_id" ON "produit_image"("produit_id");

-- CreateIndex
CREATE INDEX "index_vendeur_id" ON "produit_marketplace"("vendeur_id");

-- CreateIndex
CREATE INDEX "index_client_id" ON "signalement"("client_id");

-- CreateIndex
CREATE INDEX "index_produit_id" ON "signalement"("produit_id");

-- CreateIndex
CREATE UNIQUE INDEX "taille_nom_key" ON "taille"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "totp_secret_user_id_key" ON "totp_secret"("user_id");

-- CreateIndex
CREATE INDEX "index_user_id" ON "totp_secret"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "user"("email");

-- CreateIndex
CREATE INDEX "index_email" ON "user"("email");

-- CreateIndex
CREATE INDEX "_ProduitCouleurs_B_index" ON "_ProduitCouleurs"("B");

-- CreateIndex
CREATE INDEX "_ProduitTailles_B_index" ON "_ProduitTailles"("B");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_adresse_id_fkey" FOREIGN KEY ("adresse_id") REFERENCES "adresse"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_panier_id_fkey" FOREIGN KEY ("panier_id") REFERENCES "panier"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_commande" ADD CONSTRAINT "ligne_commande_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_commande" ADD CONSTRAINT "ligne_commande_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_commande" ADD CONSTRAINT "ligne_commande_couleur_id_fkey" FOREIGN KEY ("couleur_id") REFERENCES "couleur"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_commande" ADD CONSTRAINT "ligne_commande_taille_id_fkey" FOREIGN KEY ("taille_id") REFERENCES "taille"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_panier" ADD CONSTRAINT "ligne_panier_panier_id_fkey" FOREIGN KEY ("panier_id") REFERENCES "panier"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_panier" ADD CONSTRAINT "ligne_panier_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_panier" ADD CONSTRAINT "ligne_panier_couleur_id_fkey" FOREIGN KEY ("couleur_id") REFERENCES "couleur"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ligne_panier" ADD CONSTRAINT "ligne_panier_taille_id_fkey" FOREIGN KEY ("taille_id") REFERENCES "taille"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paiement_commande" ADD CONSTRAINT "paiement_commande_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "paiement_vendeur" ADD CONSTRAINT "paiement_vendeur_vendeur_id_fkey" FOREIGN KEY ("vendeur_id") REFERENCES "vendeur"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "panier" ADD CONSTRAINT "panier_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produit" ADD CONSTRAINT "produit_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "categorie"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produit" ADD CONSTRAINT "produit_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produit_image" ADD CONSTRAINT "produit_image_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produit_boutique" ADD CONSTRAINT "produit_boutique_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produit_marketplace" ADD CONSTRAINT "produit_marketplace_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produit_marketplace" ADD CONSTRAINT "produit_marketplace_vendeur_id_fkey" FOREIGN KEY ("vendeur_id") REFERENCES "vendeur"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reponse_evaluation" ADD CONSTRAINT "reponse_evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reponse_evaluation" ADD CONSTRAINT "reponse_evaluation_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "signalement" ADD CONSTRAINT "signalement_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "signalement" ADD CONSTRAINT "signalement_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "totp_secret" ADD CONSTRAINT "totp_secret_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_adresse_id_fkey" FOREIGN KEY ("adresse_id") REFERENCES "adresse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vendeur" ADD CONSTRAINT "vendeur_id_fkey" FOREIGN KEY ("id") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ProduitCouleurs" ADD CONSTRAINT "_ProduitCouleurs_A_fkey" FOREIGN KEY ("A") REFERENCES "couleur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProduitCouleurs" ADD CONSTRAINT "_ProduitCouleurs_B_fkey" FOREIGN KEY ("B") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProduitTailles" ADD CONSTRAINT "_ProduitTailles_A_fkey" FOREIGN KEY ("A") REFERENCES "produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProduitTailles" ADD CONSTRAINT "_ProduitTailles_B_fkey" FOREIGN KEY ("B") REFERENCES "taille"("id") ON DELETE CASCADE ON UPDATE CASCADE;
