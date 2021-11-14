import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { ExpoConfig } from './../configs/config.interface';
import { Notifications, UserToUserPushNotifications } from '.prisma/client';
import {
  U2UPostNotificationInput,
  U2UPushNotUpdateInput,
} from 'src/resolvers/notifications/dto/u2u-post-notifs.dto';
import {
  NotificationInput,
  SingleFollowNotificationsInput,
} from 'src/resolvers/notifications/dto/notification-input.dto';
import {
  NotificationSettings,
  NotificationType,
} from 'src/models/notifications.model';
import { NotificationSettingsInput } from 'src/resolvers/notifications/dto/notification-settings.dto';

@Injectable()
export class NotificationsService {
  private expo: Expo;
  private config: ExpoConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.config = configService.get<ExpoConfig>('expo');
    this.expo = new Expo({
      accessToken: this.configService.get('EXPO_ACCESS_TOKEN'),
    });
  }

  async fetchUserNotifications(userId: string): Promise<Notifications[]> {
    const notifications = await this.prisma.notifications.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        sender: true,
        post: true,
      },
    });
    return notifications;
  }

  async sendNotificationsToSingleUser(
    type: 'friendRequest' | 'follow',
    userId: string,
    senderData: SingleFollowNotificationsInput
  ): Promise<void> {
    const notifOpts = await this.fetchNotificationSettingsByUserId(userId);
    if (
      type === 'friendRequest' &&
      notifOpts &&
      notifOpts.user.expoPushToken &&
      notifOpts.friendRequestsNotificationsOn &&
      !notifOpts.pauseNotifications
    ) {
      const user = await this.prisma.user.findFirst({
        where: { id: senderData.senderId },
      });
      const notificationMessage: ExpoPushMessage = {
        to: notifOpts.user.expoPushToken,
        title: 'Friend request',
        body: `${user.username} sent you a friend request`,
        data: {
          senderId: user.id,
          notificationType: 'FRIENDREQUEST',
        },
      };
      await this.sendPushNotifications([notificationMessage]);
      await this.savePushNotifications([
        {
          userId: notifOpts.user.id,
          senderId: user.id,
          description: `${user.username} sent you a friend request`,
          notificationType: NotificationType.FRIENDREQUEST,
        },
      ]);
    }

    if (
      type === 'follow' &&
      notifOpts &&
      notifOpts.user.expoPushToken &&
      notifOpts.followNotificationsOn &&
      !notifOpts.pauseNotifications
    ) {
      const notificationMessage: ExpoPushMessage = {
        to: notifOpts.user.expoPushToken,
        title: 'Follow',
        body: `${senderData.username} started following you`,
        data: {
          senderId: senderData.senderId,
          notificationType: NotificationType.FOLLOWED,
        },
      };
      await this.sendPushNotifications([notificationMessage]);
      await this.savePushNotifications([
        {
          userId: notifOpts.user.id,
          senderId: senderData.senderId,
          description: `${senderData.username} started following you`,
          notificationType: NotificationType.FOLLOWED,
        },
      ]);
    }
  }

  async sendPushNotifications(
    messages: ExpoPushMessage[]
  ): Promise<ExpoPushTicket[][]> {
    const chunks = this.expo.chunkPushNotifications(messages);
    return Promise.all(
      chunks.map((chunk) => this.expo.sendPushNotificationsAsync(chunk))
    );
  }

  async fetchNotificationSettingsByUserId(
    userId: string
  ): Promise<NotificationSettings> {
    const notificationSettings = this.prisma.notificationSettings.findFirst({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
    return notificationSettings;
  }

  async savePushNotifications(data: NotificationInput[]): Promise<any> {
    const count = await this.prisma.notifications.createMany({
      data,
    });
    return count;
  }

  async subscribeToUserNotifications(
    notInputObject: U2UPostNotificationInput
  ): Promise<UserToUserPushNotifications> {
    const notification = this.prisma.userToUserPushNotifications.create({
      data: notInputObject,
    });
    return notification;
  }

  async updatesUser2UserNotifOpts(
    notificationId: string,
    data: U2UPushNotUpdateInput
  ): Promise<UserToUserPushNotifications> {
    const notification = this.prisma.userToUserPushNotifications.update({
      where: {
        id: notificationId,
      },
      data,
    });
    return notification;
  }

  async updateNotificationSettings(
    userId: string,
    data: NotificationSettingsInput
  ): Promise<NotificationSettings> {
    const settings = this.prisma.notificationSettings.update({
      where: {
        userId,
      },
      data,
    });
    return settings;
  }

  async fetchPushNotificationPublishers(
    userId: string
  ): Promise<UserToUserPushNotifications[]> {
    const notifications = this.prisma.userToUserPushNotifications.findMany({
      where: {
        subscriberUserId: userId,
      },
      include: {
        subscriber: true,
        publisher: true,
      },
    });
    return notifications;
  }

  async fetchPushNotificationSubscribers(
    userId: string
  ): Promise<UserToUserPushNotifications[]> {
    const notifications = this.prisma.userToUserPushNotifications.findMany({
      where: {
        publisherUserId: userId,
      },
      include: {
        subscriber: true,
        publisher: true,
      },
    });
    return notifications;
  }
}
