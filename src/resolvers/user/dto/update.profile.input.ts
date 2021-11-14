import { IsString, IsOptional, IsNumber } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  phoneNumber?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  age?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  countryCode?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ageRange?: string;

  @Field({ nullable: true })
  @IsOptional()
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profilePicture?: string;
}
