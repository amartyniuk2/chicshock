-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "senderId" TEXT;

-- AddForeignKey
ALTER TABLE "Notifications" ADD FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
