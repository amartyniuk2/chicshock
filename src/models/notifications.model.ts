import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { User as UserPrisma } from '.prisma/client';
import { Posts } from './posts.model';

export enum NotificationType {
  FRIENDREQUEST = 'FRIENDREQUEST',
  USERPOST = 'USERPOST',
  VOTINGEXPIRED = 'VOTINGEXPIRED',
  FOLLOWED = 'FOLLOWED',
}

registerEnumType(NotificationType, {
  name: 'notificationType',
  description: 'Notification type',
});

@ObjectType()
export class UserToUserPushNotifications extends BaseModel {
  subscriberUserId?: string;
  publisherUserId?: string;
  subscriber?: User;
  publisher?: User;
  postNotificationsOn?: boolean;
}

@ObjectType()
export class Notifications extends BaseModel {
  description?: string;
  userId?: string;
  notificationType?: NotificationType;
  user?: User;
  sender?: User;
  senderId?: string;
  post?: Posts;
  postId?: string;
}

@ObjectType()
export class NotificationSettings extends BaseModel {
  pauseNotifications?: boolean;
  friendRequestsNotificationsOn?: boolean;
  followNotificationsOn?: boolean;
  votingExpiredNotificationsOn?: boolean;
  user?: UserPrisma;
  userId?: string;
  sender?: UserPrisma;
  senderId?: string;
}

@ObjectType()
export class NotificationSettingsResp extends BaseModel {
  pauseNotifications?: boolean;
  friendRequestsNotificationsOn?: boolean;
  followNotificationsOn?: boolean;
  votingExpiredNotificationsOn?: boolean;
  user?: User;
  userId?: string;
}

@ObjectType()
export class UserToUserCUNotResponse {
  message?: string;
  notification: UserToUserPushNotifications;
}

@ObjectType()
export class NotifSettingsResp {
  message?: string;
  notificationSettings?: NotificationSettingsResp;
}
