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
export class UpdatePostsInput {
  @Field({ nullable: false })
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

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
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @Field()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsOptional()
  photos?: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subCategories?: string[];

  @Field({ nullable: true })
  @IsOptional()
  expiryDate?: Date;

  @Field({ nullable: true })
  @IsEnum(PostType)
  postType?: PostType;
}
