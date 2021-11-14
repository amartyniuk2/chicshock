/*
  Warnings:

  - You are about to drop the `UsersFriends` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('ACCEPTED', 'DECLINED', 'WAITING');

-- DropForeignKey
ALTER TABLE "UsersFriends" DROP CONSTRAINT "UsersFriends_friendId_fkey";

-- DropForeignKey
ALTER TABLE "UsersFriends" DROP CONSTRAINT "UsersFriends_userId_fkey";

-- DropTable
DROP TABLE "UsersFriends";

-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "friendshipStatus" "FriendshipStatus" NOT NULL DEFAULT E'WAITING',

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
