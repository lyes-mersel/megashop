/*
  Warnings:

  - A unique constraint covering the columns `[commande_id]` on the table `paiement_commande` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "commande" DROP CONSTRAINT "commande_paiement_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "paiement_commande_commande_id_key" ON "paiement_commande"("commande_id");

-- AddForeignKey
ALTER TABLE "paiement_commande" ADD CONSTRAINT "paiement_commande_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commande"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
