import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthModule } from './resolvers/auth/auth.module';
import { UserModule } from './resolvers/user/user.module';
import { AppResolver } from './resolvers/app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configs/config';
import { GraphqlConfig } from './configs/config.interface';
import { PrismaModule } from 'nestjs-prisma';
import { PostsModule } from './resolvers/posts/posts.module';
import { CategoriesModule } from './resolvers/categories/categories.module';
import { VotesModule } from './resolvers/votes/votes.module';
import { ReportsModule } from './resolvers/reports/reports.module';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './services/upload.service';
import { UploadModule } from './resolvers/upload/upload.module';
import { NotificationsModule } from './resolvers/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PostsModule,
    CategoriesModule,
    VotesModule,
    ReportsModule,
    UploadModule,
    NotificationsModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, AppResolver, UploadService],
})
export class AppModule {}
