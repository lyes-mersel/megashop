/*
  Warnings:

  - You are about to drop the column `total_notations` on the `produit` table. All the data in the column will be lost.
  - Made the column `date` on table `evaluation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `reponse_evaluation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "evaluation" ALTER COLUMN "date" SET NOT NULL;

-- AlterTable
ALTER TABLE "produit" DROP COLUMN "total_notations",
ADD COLUMN     "total_evaluations" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "reponse_evaluation" ALTER COLUMN "date" SET NOT NULL;
