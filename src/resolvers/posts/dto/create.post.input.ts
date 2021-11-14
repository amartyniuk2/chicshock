import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { PostType } from 'src/models/posts.model';

@InputType()
export class CreatePostsInput {
  @Field({ nullable: false })
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  brand?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @Field(() => [String], { nullable: false })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  photos: string[];

  @Field(() => [String], { nullable: false, defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  subCategories: string[];

  @Field({ nullable: true })
  @IsOptional()
  expiryDate?: Date;

  @Field({ nullable: true })
  @IsEnum(PostType)
  postType?: PostType;
}
