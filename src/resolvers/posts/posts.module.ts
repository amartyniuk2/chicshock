import { PostsResolver } from './posts.resolver';
import { Module } from '@nestjs/common';
import { PostsService } from 'src/services/posts.service';
import { ReportsService } from 'src/services/reports.service';
import { NotificationsService } from 'src/services/notifications.service';
import { UserService } from 'src/services/user.service';
import { PasswordService } from 'src/services/password.service';
import { VotesService } from 'src/services/votes.service';

@Module({
  imports: [],
  providers: [
    PostsResolver,
    PostsService,
    ReportsService,
    NotificationsService,
    UserService,
    PasswordService,
    VotesService,
  ],
})
export class PostsModule {}
