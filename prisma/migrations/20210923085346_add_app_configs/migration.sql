-- CreateTable
CREATE TABLE "AppConfigs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allowedReportsCountPerPost" INTEGER NOT NULL DEFAULT 3,
    "countOfBlockedPostsBeforeBan" INTEGER NOT NULL DEFAULT 3,

    PRIMARY KEY ("id")
);
