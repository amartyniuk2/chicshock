-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notificationSettings" JSONB DEFAULT E'{"friendRequest":true,"friendPost":true,"followingPeoplePost":true,"followed":true,"votingIsExpired":true}';
