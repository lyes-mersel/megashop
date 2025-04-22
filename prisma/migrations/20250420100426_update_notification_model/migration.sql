/*
  Warnings:

  - Made the column `objet` on table `notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `est_lu` on table `notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `notification` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DEFAULT', 'COMMANDE', 'LIVRAISON', 'PAIEMENT', 'SIGNALEMENT', 'EVALUATION', 'MESSAGE');

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'DEFAULT',
ALTER COLUMN "objet" SET NOT NULL,
ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "est_lu" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;
