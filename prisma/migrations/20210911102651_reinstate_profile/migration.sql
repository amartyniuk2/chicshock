/*
  Warnings:

  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User.userName_unique";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "age" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "countryOfOrigin" DROP NOT NULL,
ALTER COLUMN "countryCode" DROP NOT NULL,
ALTER COLUMN "ageRange" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userName",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");
