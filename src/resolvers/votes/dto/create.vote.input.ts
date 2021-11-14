import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEnum } from 'class-validator';
import { VoteType } from 'src/models/votes.model';

@InputType()
export class CreateVoteInput {
  @Field({ nullable: false })
  @IsEnum(VoteType)
  voteType: VoteType;

  @Field({ nullable: false })
  @IsString()
  userId: string;

  @Field({ nullable: false })
  @IsString()
  postId: string;
}

@InputType()
export class VoteInput {
  @Field({ nullable: false })
  @IsEnum(VoteType)
  voteType: VoteType;

  @Field({ nullable: false })
  @IsString()
  postId: string;
}

@InputType()
export class VoteUpdateInput {
  @Field({ nullable: false })
  @IsEnum(VoteType)
  voteType: VoteType;

  @Field({ nullable: false })
  @IsString()
  postId: string;

  @Field({ nullable: false })
  @IsString()
  id: string;
}
