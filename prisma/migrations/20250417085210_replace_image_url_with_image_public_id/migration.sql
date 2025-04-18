/*
  Warnings:

  - You are about to drop the column `image_url` on the `ligne_commande` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `ligne_panier` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `produit_image` table. All the data in the column will be lost.
  - You are about to drop the column `url_image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `NomBanque` on the `vendeur` table. All the data in the column will be lost.
  - Added the required column `image_public_id` to the `produit_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom_banque` to the `vendeur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ligne_commande" DROP COLUMN "image_url",
ADD COLUMN     "image_public_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "ligne_panier" DROP COLUMN "image_url",
ADD COLUMN     "image_public_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "produit_image" DROP COLUMN "image_url",
ADD COLUMN     "image_public_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "url_image",
ADD COLUMN     "image_public_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "vendeur" DROP COLUMN "NomBanque",
ADD COLUMN     "nom_banque" VARCHAR(50) NOT NULL;
