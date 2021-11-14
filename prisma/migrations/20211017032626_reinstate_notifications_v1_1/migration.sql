/*
  Warnings:

  - You are about to drop the column `followNotifications` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `followerNotificationList` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `friendNotificationList` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `friendRequests` on the `NotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `votingExpired` on the `NotificationSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationSettings" DROP COLUMN "followNotifications",
DROP COLUMN "followerNotificationList",
DROP COLUMN "friendNotificationList",
DROP COLUMN "friendRequests",
DROP COLUMN "votingExpired",
ADD COLUMN     "followNotificationsOn" BOOLEAN DEFAULT true,
ADD COLUMN     "friendRequestsNotificationsOn" BOOLEAN DEFAULT true,
ADD COLUMN     "votingExpiredNotificationsOn" BOOLEAN DEFAULT true,
ALTER COLUMN "pauseNotifications" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserToUserPushNotifications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriberUserId" TEXT NOT NULL,
    "publisherUserId" TEXT NOT NULL,
    "postNotificationsOn" BOOLEAN DEFAULT true,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserToUserPushNotifications" ADD FOREIGN KEY ("subscriberUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToUserPushNotifications" ADD FOREIGN KEY ("publisherUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
