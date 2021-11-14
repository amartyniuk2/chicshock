import { IsNotEmpty, MinLength, IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
