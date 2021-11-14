import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateReportInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  postId: string;
}
