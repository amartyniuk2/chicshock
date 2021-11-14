import { InputType, HideField, Field } from '@nestjs/graphql';
import { IsOptional, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { GraphQLJSONObject } from 'graphql-type-json';
import { NotificationSettingsDto } from '../../../common/dto/notification-settings';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  signupType?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  invitedBy?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userType?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  invitationStatus?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  age?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  countryCode?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ageRange?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  recoveryEmail?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  emailVerified?: boolean;

  @Field({ nullable: true })
  badgeLevel?: string;

  @Field({ nullable: true })
  @HideField()
  @IsString()
  @IsOptional()
  password?: string;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: `
         {
           followed: boolean;
           friendPost: boolean;
           friendRequest: boolean;
           votingIsExpired: boolean;
           followingPeoplePost: boolean;
         }`,
  })
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  @IsOptional()
  notificationSettings?: any; //NotificationSettings(json);

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  expoPushToken?: string;
}
