import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class U2UPostNotificationInput {
  @Field({ nullable: false })
  subscriberUserId: string;

  @Field({ nullable: false })
  publisherUserId: string;

  @Field({ nullable: true })
  postNotificationsOn?: boolean;
}

@InputType()
export class U2UPushNotInput {
  @Field({ nullable: false })
  subscriberUserId: string;

  @Field({ nullable: false })
  publisherUserId: string;

  @Field({ nullable: true })
  postNotificationsOn?: boolean;
}

@InputType()
export class U2UPushNotUpdateInput {
  @Field({ nullable: true })
  postNotificationsOn?: boolean;
}
