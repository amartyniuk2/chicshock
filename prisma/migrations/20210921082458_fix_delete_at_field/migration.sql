-- AlterTable
ALTER TABLE "Comments" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reports" ALTER COLUMN "deletedAt" DROP NOT NULL;
