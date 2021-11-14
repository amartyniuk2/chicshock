import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class NotificationSettingsInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  pauseNotifications?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  friendRequestsNotificationsOn?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  followNotificationsOn?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  votingExpiredNotificationsOn?: boolean;
}
