import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType('Pagination')
export class PaginationDto {
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  skip: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  take: number;
}
