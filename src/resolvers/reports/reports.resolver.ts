import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../decorators/user.decorator';
import { User } from '../../models/user.model';
import { ReportsService } from 'src/services/reports.service';
import { PostsService } from 'src/services/posts.service';
import { UserService } from 'src/services/user.service';
import { CreateReportInput } from './dto/create.report.input';
import { Reports } from 'src/models/reports.model';
import { handleError } from 'src/common/exceptions/exceptions';

@Resolver(() => Reports)
@UseGuards(GqlAuthGuard)
export class ReportsResolver {
  constructor(
    private reportsService: ReportsService,
    private postsService: PostsService,
    private userService: UserService
  ) {}

  @Mutation(() => Reports)
  async createReport(
    @UserEntity() user: User,
    @Args('data') data: CreateReportInput
  ) {
    let postOwnerId: string;
    try {
      const isAlredayReported =
        await this.reportsService.checkIfAlreadyReported(data.postId, user.id);

      if (isAlredayReported) {
        throw new BadRequestException('already reported');
      }

      const report = await this.reportsService.createReport(
        { ...data },
        user.id
      );

      const isRemovePost = await this.reportsService.isRemovePost(data.postId);
      if (isRemovePost) {
        const post = await this.postsService.deletePost(data.postId);
        postOwnerId = post.userId;
      }

      if (postOwnerId && (await this.reportsService.isBanUser(postOwnerId))) {
        await this.userService.banUser(postOwnerId);
      }

      return report;
    } catch (error) {
      handleError(error, 'failed to report on post');
    }
  }
}
