-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "subCategories" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL DEFAULT E'title';
