/*
  Warnings:

  - You are about to drop the column `postType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "postType" "PostType";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "postType";
