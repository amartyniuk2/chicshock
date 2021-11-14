import { IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemoveReportedPostInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
