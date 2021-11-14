import { Module } from '@nestjs/common';
import { ReportsService } from 'src/services/reports.service';
import { PostsService } from 'src/services/posts.service';
import { UserService } from 'src/services/user.service';
import { PasswordService } from 'src/services/password.service';
import { NotificationsService } from 'src/services/notifications.service';
import { ReportsResolver } from './reports.resolver';

@Module({
  imports: [],
  providers: [
    ReportsResolver,
    ReportsService,
    PostsService,
    PasswordService,
    UserService,
    NotificationsService,
  ],
})
export class ReportsModule {}
