/*
  Warnings:

  - The `phoneNumber` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `countryCode` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "recoveryEmail" TEXT,
DROP COLUMN "phoneNumber",
ADD COLUMN     "phoneNumber" INTEGER,
DROP COLUMN "countryCode",
ADD COLUMN     "countryCode" INTEGER;
