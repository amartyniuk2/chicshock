import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@InputType()
export class NotificationSettingsDto {
  @Field({ nullable: false })
  @IsBoolean()
  followed: boolean;
  @Field({ nullable: false })
  @IsBoolean()
  friendPost: boolean;
  @Field({ nullable: false })
  @IsBoolean()
  friendRequest: boolean;
  @Field({ nullable: false })
  @IsBoolean()
  votingIsExpired: boolean;
  @Field({ nullable: false })
  @IsBoolean()
  followingPeoplePost: boolean;
}

