import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignedURLResponse {
  url: string;
  durationToExpire: number;
}
