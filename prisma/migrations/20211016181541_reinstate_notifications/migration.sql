/*
  Warnings:

  - You are about to drop the column `notificationSettings` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "notificationSettings";

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pauseNotifications" BOOLEAN NOT NULL DEFAULT false,
    "friendRequests" BOOLEAN NOT NULL DEFAULT true,
    "followNotifications" BOOLEAN NOT NULL DEFAULT true,
    "votingExpired" BOOLEAN NOT NULL DEFAULT true,
    "followerNotificationList" TEXT[],
    "friendNotificationList" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_unique" ON "NotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
