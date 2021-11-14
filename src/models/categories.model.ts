import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { Posts } from './posts.model';

@ObjectType()
export class Categories extends BaseModel {
  name: string;
  deletedAt?: Date;
  isActive: boolean;
  user?: User;
  userId?: string;
  posts?: Posts[];
}
