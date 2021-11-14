-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "Notifications" ADD FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
