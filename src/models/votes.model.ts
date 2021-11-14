import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from './base.model';
import { Posts } from './posts.model';
import { User } from './user.model';

export enum VoteType {
  VERYCOOL = 'VERYCOOL',
  COOL = 'COOL',
  FIRE = 'FIRE',
  CHIC = 'CHIC',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  SHOCK = 'SHOCK',
}

registerEnumType(VoteType, {
  name: 'voteType',
  description: 'Vote type',
});

@ObjectType()
export class VotesResponse {
  message?: string;
  votes?: Votes;
  voteStats?: VoteStats;
}

@ObjectType()
export class Votes extends BaseModel {
  voteType: VoteType;
  userId?: string;
  postId?: string;
  user?: User;
  post?: Posts[];
}

@ObjectType()
export class FetchVotesOnPostResponse {
  message?: string;
  votes?: Votes[];
  voteStats?: VoteStats;
}

@ObjectType()
export class VoteStats {
  overallVotes?: number;
  VERYCOOL?: number;
  COOL?: number;
  FIRE?: number;
  CHIC?: number;
  LEFT?: number;
  RIGHT?: number;
  SHOCK?: number;
}
