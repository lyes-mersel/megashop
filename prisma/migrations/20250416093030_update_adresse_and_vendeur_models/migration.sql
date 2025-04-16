/*
  Warnings:

  - You are about to drop the column `pays` on the `adresse` table. All the data in the column will be lost.
  - Added the required column `wilaya` to the `adresse` table without a default value. This is not possible if the table is not empty.
  - Made the column `rue` on table `adresse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ville` on table `adresse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code_postal` on table `adresse` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `NomBanque` to the `vendeur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adresse" DROP COLUMN "pays",
ADD COLUMN     "wilaya" VARCHAR(100) NOT NULL,
ALTER COLUMN "rue" SET NOT NULL,
ALTER COLUMN "ville" SET NOT NULL,
ALTER COLUMN "code_postal" SET NOT NULL;

-- AlterTable
ALTER TABLE "vendeur" ADD COLUMN     "NomBanque" VARCHAR(50) NOT NULL;
