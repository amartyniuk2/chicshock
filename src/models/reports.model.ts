import { ObjectType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { Posts } from './posts.model';
import { User } from './user.model';

@ObjectType()
export class Reports extends BaseModel {
  reason: string;
  userId: string;
  postId: string;
  user?: User;
  post?: Posts;
}
