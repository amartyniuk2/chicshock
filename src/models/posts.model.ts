import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { Categories } from './categories.model';
import { Votes, VoteStats } from './votes.model';

export enum PostType {
  MAKEOVER = 'MAKEOVER',
  STANDARD = 'STANDARD',
  COMPARE = 'COMPARE',
}

registerEnumType(PostType, { name: 'postType' });

@ObjectType()
export class Posts extends BaseModel {
  title: string;
  brand?: string;
  description?: string;
  location?: string;
  deletedAt?: Date;
  expiryDate?: Date;
  isArchived?: boolean;
  isDeleted?: boolean;
  isPrivate?: boolean;
  photos: string[];
  subCategories: string[];
  user?: User;
  userId?: string;
  votes?: Votes[];
  category?: Categories;
  postType?: PostType;
  voteStats?: VoteStats;
}
