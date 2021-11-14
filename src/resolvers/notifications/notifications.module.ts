import { NotificationsService } from './../../services/notifications.service';
import { Module } from '@nestjs/common';
import { NotificationsResolver } from './notifications.resolver';
import { UserService } from 'src/services/user.service';
import { PasswordService } from 'src/services/password.service';

@Module({
  imports: [],
  providers: [
    NotificationsResolver,
    NotificationsService,
    UserService,
    PasswordService,
  ],
})
export class NotificationsModule {}
