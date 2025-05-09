/*
  Warnings:

  - Made the column `date` on table `commande` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statut` on table `commande` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'SECURITE';

-- AlterTable
ALTER TABLE "commande" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "statut" SET NOT NULL;
