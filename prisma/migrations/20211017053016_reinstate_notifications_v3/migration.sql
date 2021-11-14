/*
  Warnings:

  - Changed the type of `notificationType` on the `Notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIENDREQUEST', 'USERPOST', 'VOTINGEXPIRED', 'FOLLOWED');

-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "notificationType",
ADD COLUMN     "notificationType" "NotificationType" NOT NULL;
