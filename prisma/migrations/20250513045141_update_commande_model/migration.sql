/*
  Warnings:

  - Made the column `date` on table `paiement_commande` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statut` on table `paiement_commande` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "paiement_commande" DROP CONSTRAINT "paiement_commande_commande_id_fkey";

-- AlterTable
ALTER TABLE "commande" ADD COLUMN     "paiement_id" VARCHAR(25);

-- AlterTable
ALTER TABLE "paiement_commande" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "statut" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "commande" ADD CONSTRAINT "commande_paiement_id_fkey" FOREIGN KEY ("paiement_id") REFERENCES "paiement_commande"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
