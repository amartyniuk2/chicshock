import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { User } from './user.model';

@ObjectType()
export class Followers extends BaseModel {
  follower?: User;
  followerId?: string;
  user?: User;
  userId?: string;
}

@ObjectType()
export class FollowUnFollowResponse {
  message: string;
}

@ObjectType()
export class CheckIfFollowExistsResponse {
  isFollowExistant: boolean;
  follow: Followers;
}
