import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;
}
