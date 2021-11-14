import { InputType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { NotificationType } from 'src/models/notifications.model';

@InputType()
export class NotificationInput {
  @Field({ nullable: false })
  description: string;

  @Field({ nullable: true })
  senderId?: string;

  @Field({ nullable: false })
  userId: string;

  @Field({ nullable: false })
  @IsEnum(NotificationType)
  notificationType: NotificationType;
}

@InputType()
export class SingleFollowNotificationsInput {
  @Field({ nullable: false })
  username: string;

  @Field({ nullable: false })
  senderId: string;
}
