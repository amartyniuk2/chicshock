INSERT INTO "AppConfigs"
  ("id", "updatedAt", "allowedReportsCountPerPost", "countOfBlockedPostsBeforeBan")
    VALUES (gen_random_uuid(), now(), 3,3);
