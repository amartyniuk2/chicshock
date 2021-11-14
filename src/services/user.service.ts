import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { NotificationsService } from './notifications.service';
import { ChangePasswordInput } from '../resolvers/user/dto/change-password.input';
import { UpdateUserInput } from 'src/resolvers/user/dto/update.user.input';
import { Followers } from 'src/models/followers.model';
import { User, Friends } from '.prisma/client';
import { FriendshipInput } from 'src/resolvers/user/dto/friendship.input';
import { PaginationDto } from 'src/common/dto/pagination';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private passwordService: PasswordService,
    private notificationsService: NotificationsService
  ) {}

  async updateUserInformation(
    id: string,
    newUserData: UpdateUserInput
  ): Promise<User> {
    const userReturn = this.prisma.user.update({
      where: {
        id,
      },
      data: newUserData,
    });
    return userReturn;
  }

  async updateFriendshipInformation(
    id: string,
    friendshipData: FriendshipInput
  ): Promise<Friends> {
    const friendship = this.prisma.friends.update({
      where: {
        id,
      },
      data: friendshipData,
    });
    return friendship;
  }

  async addFriend(userId: string, friendId: string): Promise<Friends> {
    const friendship = this.prisma.friends.create({
      data: {
        userId,
        friendId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // check settings for this operation
    this.notificationsService.sendNotificationsToSingleUser(
      'friendRequest',
      friendId,
      {
        senderId: userId,
        username: user.username,
      }
    );
    return friendship;
  }

  async removeFriend(friendRecordId: string): Promise<Friends> {
    return this.prisma.friends.delete({
      where: {
        id: friendRecordId,
      },
    });
  }

  async checkIfFriendAlreadyAdded(
    userId: string,
    friendId: string
  ): Promise<{ isFriended: boolean; friendship?: Friends }> {
    const friendship = await this.prisma.friends.findFirst({
      where: {
        userId,
        friendId,
      },
    });
    if (friendship) {
      return { isFriended: true, friendship };
    }
    return { isFriended: false };
  }

  async getUser(userId: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { id: userId },
      rejectOnNotFound: true,
      include: {
        followers: true,
        following: true,
      },
    });
  }

  async fetchAllUsers(pagination?: PaginationDto): Promise<User[]> {
    const users: any[] = await this.prisma.user.findMany({
      skip: pagination.skip,
      take: pagination.take,
      include: {
        friends: {
          include: {
            user: true,
          },
        },
        friended: {
          include: {
            friend: true,
          },
        },
      },
    });

    for (const user of users) {
      const friends = [];
      user.friends.map((friend: any) =>
        friends.push({
          friend: friend.user,
          id: friend.id,
          createdAt: friend.createdAt,
          updatedAt: friend.updatedAt,
          userId: friend.userId,
          friendId: friend.friendId,
          friendshipStatus: friend.friendshipStatus,
        })
      );
      user.friended.map((friend: any) =>
        friends.push({
          friend: friend.friend,
          id: friend.id,
          createdAt: friend.createdAt,
          updatedAt: friend.updatedAt,
          userId: friend.userId,
          friendId: friend.friendId,
          friendshipStatus: friend.friendshipStatus,
        })
      );
      user.friends = friends;
    }

    return users;
  }

  async fetchProfile(userId: string): Promise<User> {
    const userProfileReturn: any = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        voted: true,
        followers: {
          include: {
            follower: {
              include: {
                notificationSettings: true,
              },
            },
          },
        },
        following: {
          include: {
            user: {
              include: {
                notificationSettings: true,
              },
            },
          },
        },
        notifications: true,
        notificationSettings: true,
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        friends: {
          include: {
            user: {
              include: {
                notificationSettings: true,
              },
            },
          },
        },
        friended: {
          include: {
            friend: {
              include: {
                notificationSettings: true,
              },
            },
          },
        },
      },
    });

    const friends = [];
    userProfileReturn.friends.map((friend: any) =>
      friends.push({
        friend: friend.user,
        id: friend.id,
        createdAt: friend.createdAt,
        updatedAt: friend.updatedAt,
        userId: friend.userId,
        friendId: friend.friendId,
        friendshipStatus: friend.friendshipStatus,
      })
    );
    userProfileReturn.friended.map((friend: any) =>
      friends.push({
        friend: friend.friend,
        id: friend.id,
        createdAt: friend.createdAt,
        updatedAt: friend.updatedAt,
        userId: friend.userId,
        friendId: friend.friendId,
        friendshipStatus: friend.friendshipStatus,
      })
    );
    userProfileReturn.friends = friends;

    return userProfileReturn;
  }

  async checkIfFollowAlreadyExists(
    userId: string,
    followerId: string
  ): Promise<{ isFollowing: boolean; follow: Followers }> {
    const follow = await this.prisma.followers.findFirst({
      where: {
        userId,
        followerId,
      },
    });
    if (follow) {
      return { isFollowing: true, follow };
    }
    return { isFollowing: false, follow };
  }

  async followUser(userId: string, followerId: string): Promise<User> {
    await this.prisma.followers.create({
      data: {
        userId,
        followerId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: followerId,
      },
      include: {
        followers: true,
        following: true,
      },
    });

    this.notificationsService.sendNotificationsToSingleUser('follow', userId, {
      senderId: user.id,
      username: user.username,
    });
    return user;
  }

  async unFollowUser(followId: string): Promise<string> {
    await this.prisma.followers.delete({
      where: {
        id: followId,
      },
    });
    return 'successfully unfollowed user';
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  async banUser(userId: string): Promise<User> {
    // TODO: add some logic?
    return this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });
  }
}
