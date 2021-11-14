import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength, IsString } from 'class-validator';

@InputType()
export class SignupInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field({ nullable: true })
  @IsString()
  signupType: 'email' | 'facebook' | 'google';

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  platformId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  platformToken: string;

  @Field({ nullable: true })
  @MinLength(8)
  @IsOptional()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  expoPushToken?: string;
}
