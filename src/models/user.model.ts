import { ObjectType, HideField, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { Followers } from './followers.model';
import { Friends } from './friends.model';
import { NotificationType } from './notifications.model';
import { Posts } from './posts.model';
import { Votes } from './votes.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, { name: 'role' });

@ObjectType()
export class NotificationsP extends BaseModel {
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
export class NotificationSettingsP extends BaseModel {
  pauseNotifications?: boolean;
  friendRequestsNotificationsOn?: boolean;
  followNotificationsOn?: boolean;
  votingExpiredNotificationsOn?: boolean;
  user?: User;
  userId?: string;
}

@ObjectType()
export class User extends BaseModel {
  signupType?: string;
  invitedBy?: string;
  invitationStatus: string;
  isBanned: boolean;
  status?: string;
  emailVerified?: boolean;
  badgeLevel?: string;
  username?: string;
  userType?: string;
  email?: string;
  role?: Role;
  followers?: Followers[];
  following?: Followers[];
  friended?: Friends[];
  friends?: Friends[];
  posts?: Posts[];
  voted?: Votes[];
  @HideField()
  password: string;
  notifications?: NotificationsP[];
  notificationSettings?: NotificationSettingsP;
  expoPushToken?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  city?: number;
  age?: number;
  gender: string;
  countryOfOrigin?: string;
  countryCode?: number;
  ageRange?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  recoveryEmail?: string;
  bio?: string;
  platformId?: string;
  platformToken?: string;
}

@ObjectType()
export class UpdateUserReturn {
  message: string;
  user: User;
}

@ObjectType()
export class AllUsersResponse {
  message: string;
  users: User[];
}
