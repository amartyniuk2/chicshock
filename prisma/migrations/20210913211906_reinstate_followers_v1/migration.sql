/*
  Warnings:

  - You are about to drop the column `followingId` on the `Followers` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Followers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_followingId_fkey";

-- AlterTable
ALTER TABLE "Followers" DROP COLUMN "followingId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Followers" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
