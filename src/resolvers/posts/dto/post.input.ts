import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { PostType } from 'src/models/posts.model';

@InputType()
export class PostsInput {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  isArchived?: boolean;

  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  categoryId?: string;

  @Field({ nullable: true })
  isPrivate?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  photos: string[];

  @Field({ nullable: true })
  @IsEnum(PostType)
  postType?: PostType;
}
