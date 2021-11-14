/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "countryCode" INTEGER,
ADD COLUMN     "countryOfOrigin" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" INTEGER,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "recoveryEmail" TEXT;

-- DropTable
DROP TABLE "Profile";
