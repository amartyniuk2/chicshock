/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Views` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" TEXT DEFAULT E'normal';

-- AlterTable
ALTER TABLE "Views" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- AddForeignKey
ALTER TABLE "Views" ADD FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
