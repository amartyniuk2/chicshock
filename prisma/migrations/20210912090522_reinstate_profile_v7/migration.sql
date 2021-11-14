/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey";

-- RenameIndex
ALTER INDEX "Profile_userId_unique" RENAME TO "Profile.userId_unique";
