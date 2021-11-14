import { InputType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { FriendshipStatus } from 'src/models/friends.model';

@InputType()
export class FriendshipInput {
  @Field({ nullable: false })
  @IsEnum(FriendshipStatus)
  friendshipStatus: FriendshipStatus;
}
