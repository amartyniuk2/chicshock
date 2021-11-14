import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserEntity } from '../../decorators/user.decorator';
import { User, Role } from '../../models/user.model';
import { PostsService } from 'src/services/posts.service';
import { ReportsService } from 'src/services/reports.service';
import { Posts } from 'src/models/posts.model';
import { CreatePostsInput } from './dto/create.post.input';
import { UpdatePostsInput } from './dto/update.post.input';
import { RemoveReportedPostInput } from './dto/remove.reported.post.input';
import { PaginationDto } from 'src/common/dto/pagination';
import { handleError } from 'src/common/exceptions/exceptions';
import { VotesService } from 'src/services/votes.service';

@Resolver(() => Posts)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private reportsService: ReportsService,
    private votesService: VotesService
  ) {}

  @Query(() => [Posts])
  async fetchWall(
    @Args({ name: 'pagination', defaultValue: {} }) pagination?: PaginationDto
  ) {
    try {
      const posts = await this.postsService.fetchWall(pagination);
      const formattedPosts = await this.votesService.addVoteStatsToPosts(posts);
      return formattedPosts;
    } catch (error) {
      handleError(error, 'failed to fetch home feed');
    }
  }

  @Query(() => [Posts])
  @UseGuards(GqlAuthGuard)
  async fetchUserPosts(
    @UserEntity() user: User,
    @Args({ name: 'pagination', defaultValue: {} }) pagination?: PaginationDto
  ) {
    try {
      const posts = await this.postsService.fetchUserPosts(user.id, pagination);
      const formattedPosts = await this.votesService.addVoteStatsToPosts(posts);
      return formattedPosts;
    } catch (error) {
      handleError(error, 'failed to fetch user posts');
    }
  }

  @Query(() => Posts)
  @UseGuards(GqlAuthGuard)
  async fetchPostById(@Args('postId') postId: string) {
    try {
      const post = await this.postsService.fetchPostById(postId);
      const formattedPosts = await this.votesService.addVoteStatsToPosts([
        post,
      ]);
      return formattedPosts[0];
    } catch (error) {
      handleError(error, 'failed to fetch post by id');
    }
  }

  @Query(() => [Posts])
  @UseGuards(GqlAuthGuard)
  async fetchPostsByUserId(
    @Args('userId') userId: string,
    @Args({ name: 'pagination', defaultValue: {} }) pagination?: PaginationDto
  ) {
    try {
      const posts = await this.postsService.fetchUserPosts(userId, pagination);
      const formattedPosts = await this.votesService.addVoteStatsToPosts(posts);
      return formattedPosts;
    } catch (error) {
      handleError(error, 'failed to fetch user posts');
    }
  }

  @Mutation(() => Posts)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @UserEntity() user: User,
    @Args('data') data: CreatePostsInput
  ) {
    try {
      const post = await this.postsService.createPost({
        ...data,
        userId: user.id,
      });
      return post;
    } catch (error) {
      console.error(error);
      handleError(error, 'failed to create post');
    }
  }

  @Mutation(() => Posts)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @UserEntity() user: User,
    @Args('data') data: UpdatePostsInput
  ) {
    try {
      const post = await this.postsService.updatePost({
        ...data,
        userId: user.id,
      });
      return post;
    } catch (error) {
      handleError(error, 'failed to update post');
    }
  }

  @Mutation(() => Posts)
  @UseGuards(GqlAuthGuard)
  async deletePost(@Args('postId') postId: string) {
    try {
      const post = await this.postsService.deletePost(postId);
      return post;
    } catch (error) {
      handleError(error, 'failed to delete post');
    }
  }

  // remove or block a given post from the users profile, the one whose post was reported
  @Mutation(() => Posts, { description: 'method for admins only' })
  @UseGuards(GqlAuthGuard)
  async removeReportedPost(
    @UserEntity() user: User,
    @Args('data') data: RemoveReportedPostInput
  ) {
    try {
      if (user.role !== Role.ADMIN) {
        throw new ForbiddenException('only for admins');
      }

      const reports = await this.reportsService.getReports({
        postId: data.postId,
      });

      if (!reports.length) {
        throw new BadRequestException(`post wasn't reported`);
      }
      return this.postsService.deletePost(data.postId);
    } catch (error) {
      handleError(error, 'failed to remove post');
    }
  }
}
