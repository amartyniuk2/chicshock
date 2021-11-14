import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../../decorators/user.decorator';
import { User } from '../../models/user.model';
import { VotesService } from 'src/services/votes.service';
import { VoteInput, VoteUpdateInput } from './dto/create.vote.input';
import {
  FetchVotesOnPostResponse,
  Votes,
  VotesResponse,
} from 'src/models/votes.model';
import { PaginationDto } from 'src/common/dto/pagination';
import { handleError } from 'src/common/exceptions/exceptions';

@Resolver(() => Votes)
@UseGuards(GqlAuthGuard)
export class VotesResolver {
  constructor(private votesService: VotesService) {}

  @Query(() => FetchVotesOnPostResponse)
  async fetchVotesOnPost(
    @Args('postId') postId: string,
    @Args({ name: 'pagination', defaultValue: {} }) pagination?: PaginationDto
  ) {
    try {
      const votes = await this.votesService.fetchVotesOnPost(
        postId,
        pagination
      );
      const voteStats = await this.votesService.fetchVoteStats(postId);
      return {
        votes,
        message: 'successfully fetch votes on this post',
        voteStats,
      };
    } catch (error) {
      handleError(error, 'failed to fetch votes on post');
    }
  }

  @Query(() => VotesResponse)
  async checkIfVoteAlreadyExists(
    @UserEntity() user: User,
    @Args('postId') postId: string
  ) {
    try {
      const voteAlreadyExistant =
        await this.votesService.checkIfVoteAlreadyExists(postId, user.id);

      const voteStats = await this.votesService.fetchVoteStats(postId);
      return {
        message: 'successfully checked for your vote existance',
        votes: voteAlreadyExistant,
        voteStats,
      };
    } catch (error) {
      console.log('error', error);
      handleError(error, 'failed to check for vote existence');
    }
  }

  @Mutation(() => VotesResponse)
  async unVotePost(@UserEntity() user: User, @Args('postId') postId: string) {
    try {
      const voteAlreadyExistant =
        await this.votesService.checkIfVoteAlreadyExists(postId, user.id);

      if (!voteAlreadyExistant) {
        return {
          message: 'please vote on post inorder to use this operation',
        };
      }

      const vote = await this.votesService.deleteVote(voteAlreadyExistant.id);
      const voteStats = await this.votesService.fetchVoteStats(postId);
      return {
        message: 'successfully un voted post',
        votes: vote,
        voteStats,
      };
    } catch (error) {
      handleError(error, 'failed to vote on post');
    }
  }

  @Mutation(() => VotesResponse)
  async votePost(@UserEntity() user: User, @Args('data') data: VoteInput) {
    try {
      const voteAlreadyExistant =
        await this.votesService.checkIfVoteAlreadyExists(data.postId, user.id);

      let vote = {};
      if (voteAlreadyExistant) {
        const updateData: VoteUpdateInput = {
          id: voteAlreadyExistant.id,
          postId: voteAlreadyExistant.postId,
          voteType: data.voteType,
        };
        vote = await this.votesService.updateVoteOnPost(updateData);
      }

      if (!voteAlreadyExistant) {
        vote = await this.votesService.votePost({
          ...data,
          userId: user.id,
        });
      }

      const voteStats = await this.votesService.fetchVoteStats(data.postId);
      return {
        votes: vote,
        message: voteAlreadyExistant
          ? `successfully updated vote to ${data.voteType}`
          : 'successfully voted post',
        voteStats,
      };
    } catch (error) {
      handleError(error, 'failed to vote on post');
    }
  }
}
