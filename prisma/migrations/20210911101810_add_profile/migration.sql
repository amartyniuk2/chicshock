/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `countryOfOrigin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User.username_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "ageRange",
DROP COLUMN "city",
DROP COLUMN "countryCode",
DROP COLUMN "countryOfOrigin",
DROP COLUMN "dateOfBirth",
DROP COLUMN "firstname",
DROP COLUMN "gender",
DROP COLUMN "lastname",
DROP COLUMN "phoneNumber",
DROP COLUMN "username",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "countryOfOrigin" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "profilePicture" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_unique" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User.userName_unique" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Profile" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
