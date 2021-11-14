import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { User } from './user.model';

export enum FriendshipStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  WAITING = 'WAITING',
}

registerEnumType(FriendshipStatus, {
  name: 'friendshipStatus',
  description: 'Friendship status',
});

@ObjectType()
export class Friends extends BaseModel {
  friend?: User;
  friendId?: string;
  user?: User;
  userId?: string;
  friendshipStatus: FriendshipStatus;
}

@ObjectType()
export class CheckIfFriendExistsResponse {
  isFriended: boolean;
  friendship: Friends;
}

@ObjectType()
export class FriendshipReturn {
  message?: string;
  friendship?: Friends;
}
