-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('MAKEOVER', 'STANDARD', 'COMPARE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "postType" "PostType";
