import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: false })
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
}
