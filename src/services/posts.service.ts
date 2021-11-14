import { PrismaService } from 'nestjs-prisma';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreatePostsInput } from 'src/resolvers/posts/dto/create.post.input';
import { UpdatePostsInput } from 'src/resolvers/posts/dto/update.post.input';
import { Posts } from '.prisma/client';
import { PaginationDto } from 'src/common/dto/pagination';
import { NotificationsService } from './notifications.service';
import { UserService } from './user.service';
import { NotificationType } from 'src/models/notifications.model';
import { Followers } from 'src/models/followers.model';
import { Friends } from 'src/models/friends.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationsService: NotificationsService,
    private userService: UserService
  ) {}

  async createPost(
    post: CreatePostsInput & { userId: string }
  ): Promise<Posts> {
    const createdPost = await this.prisma.posts.create({
      data: {
        ...post,
      },
      include: {
        user: {
          include: {
            followers: {
              include: {
                user: true,
              },
            },
          },
        },
        views: true,
        votes: true,
        reports: true,
        category: true,
        comments: true,
      },
    });

    this.sendPostPushNotifications(post.userId, createdPost.id);
    return createdPost;
  }

  async sendPostPushNotifications(
    userId: string,
    postId: string
  ): Promise<{ message: string }> {
    try {
      const usersToReceiveNotifs = {};
      const userProfile: any = await this.userService.fetchProfile(userId);
      userProfile.followers.map((follower: Followers) => {
        const {
          follower: { expoPushToken, notificationSettings },
        } = follower;
        if (
          expoPushToken &&
          notificationSettings &&
          !notificationSettings.pauseNotifications
        ) {
          usersToReceiveNotifs[expoPushToken] = follower.follower;
        }
        return;
      });
      userProfile.friends.map((friend: Friends) => {
        const { expoPushToken, notificationSettings } = friend.friend;
        if (
          expoPushToken &&
          notificationSettings &&
          !notificationSettings.pauseNotifications
        ) {
          usersToReceiveNotifs[expoPushToken] = friend.friend;
        }
        return;
      });

      const pushNotifications = Object.keys(usersToReceiveNotifs).map((key) => {
        return {
          to: usersToReceiveNotifs[key].expoPushToken,
          title: 'New post ',
          body: `${userProfile.username} has uploaded a new post`,
          data: {
            senderId: userProfile.id,
            postId,
            notificationType: NotificationType.USERPOST,
          },
        };
      });
      await this.notificationsService.sendPushNotifications(pushNotifications);
      await this.notificationsService.savePushNotifications(
        Object.keys(usersToReceiveNotifs).map((key) => {
          return {
            userId: usersToReceiveNotifs[key].id,
            senderId: userProfile.id,
            postId,
            description: `${userProfile.username} has uploaded a new post`,
            notificationType: NotificationType.USERPOST,
          };
        })
      );
    } catch (error) {
      return {
        message: `failed to send push notifications on ${new Date()}`,
      };
    }
  }

  async updatePost(
    post: UpdatePostsInput & { userId: string }
  ): Promise<Posts> {
    const _post = await this.prisma.posts.findUnique({
      where: { id: post.id },
    });
    if (_post.userId !== post.userId) {
      throw new ForbiddenException(`You cannot update another user's post`);
    }
    const updatedPost = this.prisma.posts.update({
      where: { id: post.id },
      data: { ...post },
    });
    return updatedPost;
  }

  async deletePost(postId: string): Promise<Posts> {
    const deletedPost = this.prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
      include: {
        user: true,
        views: true,
        votes: true,
        reports: true,
        category: true,
        comments: true,
      },
    });
    return deletedPost;
  }

  async fetchWall(pagination: PaginationDto): Promise<Posts[]> {
    const posts = this.prisma.posts.findMany({
      take: pagination.take,
      skip: pagination.skip,
      where: {
        isArchived: false,
        isPrivate: false,
        isDeleted: false,
      },
      include: {
        user: true,
        views: true,
        votes: true,
        reports: true,
        category: true,
        comments: true,
      },
    });

    return posts;
  }

  async fetchPostById(postId: string): Promise<Posts> {
    const post = this.prisma.posts.findFirst({
      where: {
        id: postId,
      },
      include: {
        user: true,
        views: true,
        votes: true,
        reports: true,
        category: true,
        comments: true,
      },
    });
    return post;
  }

  async fetchUserPosts(
    userId: string,
    pagination?: PaginationDto
  ): Promise<Posts[]> {
    const posts = this.prisma.posts.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where: {
        userId,
        isDeleted: false,
        isArchived: false,
      },
      include: {
        user: true,
        views: true,
        votes: true,
        reports: true,
        category: true,
        comments: true,
      },
    });
    return posts;
  }
}
