/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageRange` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryOfOrigin` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedBy` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signupType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "ageRange" TEXT NOT NULL,
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "countryOfOrigin" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "invitedBy" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "signupType" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");
