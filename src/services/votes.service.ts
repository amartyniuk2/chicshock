import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Votes } from '.prisma/client';
import {
  CreateVoteInput,
  VoteUpdateInput,
} from 'src/resolvers/votes/dto/create.vote.input';
import { PaginationDto } from 'src/common/dto/pagination';
import { groupBy } from 'lodash';
import { VoteStats } from 'src/models/votes.model';
import { Posts } from 'src/models/posts.model';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async votePost(vote: CreateVoteInput): Promise<Votes> {
    const createdVote = this.prisma.votes.create({
      data: {
        ...vote,
      },
    });
    return createdVote;
  }

  async updateVoteOnPost(vote: VoteUpdateInput): Promise<Votes> {
    const createdVote = this.prisma.votes.update({
      where: {
        id: vote.id,
      },
      data: {
        ...vote,
      },
    });
    return createdVote;
  }

  async checkIfVoteAlreadyExists(
    postId: string,
    userId: string
  ): Promise<Votes> {
    const vote = this.prisma.votes.findFirst({
      where: {
        postId,
        userId,
      },
    });
    return vote;
  }

  async fetchVoteStats(postId: string): Promise<VoteStats> {
    const votes = await this.prisma.votes.findMany({
      where: {
        postId: postId,
      },
    });
    const groupByVoteType = (row: Votes) => row.voteType;
    const groupedVotesByType = groupBy(votes, groupByVoteType);
    const totalVotes = Object.values(groupedVotesByType).length;

    const stats: VoteStats = {
      overallVotes: totalVotes,
      VERYCOOL: 0,
      COOL: 0,
      FIRE: 0,
      CHIC: 0,
      LEFT: 0,
      RIGHT: 0,
      SHOCK: 0,
    };

    for (const stat of Object.keys(stats)) {
      if (groupedVotesByType[stat]) {
        stats[stat] = (groupedVotesByType[stat].length / totalVotes) * 100;
      }
    }

    return stats;
  }

  async addVoteStatsToPosts(posts: Posts[] | any[]): Promise<Posts[]> {
    for (const post of posts) {
      post.voteStats = await this.fetchVoteStats(post.id);
    }
    return posts;
  }

  async fetchVotesOnPost(
    postId: string,
    pagination?: PaginationDto
  ): Promise<Votes[]> {
    const votes = this.prisma.votes.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where: {
        postId: postId,
      },
      include: {
        user: true,
        post: true,
      },
    });
    return votes;
  }

  async deleteVote(voteId: string): Promise<Votes> {
    const deletedVote = this.prisma.votes.delete({
      where: {
        id: voteId,
      },
    });
    return deletedVote;
  }
}
