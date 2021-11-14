import { PrismaClient } from '@prisma/client';
import { testCategories, testPosts, testUsers } from '../test/_test_data_/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  await prisma.notifications.deleteMany({});
  await prisma.notificationSettings.deleteMany({});
  await prisma.reports.deleteMany({});
  await prisma.categories.deleteMany({});
  await prisma.votes.deleteMany({});
  await prisma.posts.deleteMany({});
  await prisma.friends.deleteMany({});
  await prisma.followers.deleteMany({});
  await prisma.user.deleteMany({});

  const users = await prisma.user.createMany({
    data: testUsers,
  });

  const categories = await prisma.categories.createMany({
    data: testCategories,
  });

  const posts = await prisma.posts.createMany({
    data: testPosts,
  });

  console.log('user seeds count =>', users);
  console.log('categories seeds count =>', categories);
  console.log('posts seeds count =>', posts);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
