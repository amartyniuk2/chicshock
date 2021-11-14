import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationsService } from 'src/services/notifications.service';
import { handleError } from 'src/common/exceptions/exceptions';
import { UserEntity } from '../../decorators/user.decorator';
import { User } from '../../models/user.model';
import {
  Notifications,
  NotifSettingsResp,
  UserToUserCUNotResponse,
  UserToUserPushNotifications,
} from 'src/models/notifications.model';
import {
  U2UPushNotInput,
  U2UPushNotUpdateInput,
} from './dto/u2u-post-notifs.dto';
import { UserService } from 'src/services/user.service';
import { NotificationSettingsInput } from './dto/notification-settings.dto';

@Resolver(() => UserToUserPushNotifications)
@UseGuards(GqlAuthGuard)
export class NotificationsResolver {
  constructor(
    private notificationsService: NotificationsService,
    private userService: UserService
  ) {}

  // fetch users subscribed to receiver notifications from you
  @Query(() => [UserToUserPushNotifications])
  async fetchPushNotificationSubscribers(@UserEntity() user: User) {
    try {
      const notifications =
        await this.notificationsService.fetchPushNotificationSubscribers(
          user.id
        );
      return notifications;
    } catch (error) {
      handleError(error, 'failed to fetch notification subscribers');
    }
  }

  // fetch users you subscribed to receive push notifications from
  @Query(() => [UserToUserPushNotifications])
  async fetchPushNotificationPublishers(@UserEntity() user: User) {
    try {
      const notifications =
        await this.notificationsService.fetchPushNotificationPublishers(
          user.id
        );
      return notifications;
    } catch (error) {
      handleError(error, 'failed to fetch notification publishers');
    }
  }

  @Query(() => [Notifications])
  async fetchUserNotifications(@UserEntity() user: User) {
    try {
      const notifications =
        await this.notificationsService.fetchUserNotifications(user.id);
      return notifications;
    } catch (error) {
      handleError(error, 'failed to fetch notifications');
    }
  }

  @Mutation(() => UserToUserCUNotResponse)
  async subscribeToUserNotifications(
    @UserEntity() user: User,
    @Args('publisherUserId') publisherUserId: string,
    @Args('data') data?: U2UPushNotInput
  ) {
    try {
      // check if friendship or follow exists
      const follow = await this.userService.checkIfFollowAlreadyExists(
        publisherUserId,
        user.id
      );

      if (!follow.isFollowing) {
        return {
          message:
            'please follow this user in order to turn on post notifications from them',
        };
      }

      const notifications =
        this.notificationsService.subscribeToUserNotifications({
          subscriberUserId: user.id,
          publisherUserId,
          ...data,
        });
      return {
        message: 'successfully subscribed to this users push notifications',
        notification: notifications,
      };
    } catch (error) {
      handleError(
        error,
        'failed to subscriber to this users push notifications'
      );
    }
  }

  @Mutation(() => UserToUserCUNotResponse)
  async updatesUser2UserNotifOpts(
    @Args('notificationId') notificationId: string,
    @Args('data') data?: U2UPushNotUpdateInput
  ) {
    try {
      const notifications = this.notificationsService.updatesUser2UserNotifOpts(
        notificationId,
        data
      );
      return {
        message: 'successfully updated notifications',
        notification: notifications,
      };
    } catch (error) {
      handleError(
        error,
        'failed to subscriber to this users push notifications'
      );
    }
  }

  @Mutation(() => NotifSettingsResp)
  async updateNotificationSettings(
    @UserEntity() user: User,
    @Args('data') data: NotificationSettingsInput
  ) {
    try {
      const notifications =
        await this.notificationsService.updateNotificationSettings(
          user.id,
          data
        );
      return {
        message: 'successfully updated notification settings',
        notificationSettings: notifications,
      };
    } catch (error) {
      handleError(error, 'failed to update notification settings');
    }
  }
}
