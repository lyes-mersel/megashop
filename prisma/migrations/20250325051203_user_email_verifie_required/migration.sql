/*
  Warnings:

  - Made the column `email_verifie` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `email_verifie` BOOLEAN NOT NULL DEFAULT false;
