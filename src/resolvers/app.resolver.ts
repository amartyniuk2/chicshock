import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  appConfig() {
    return 'v0.1';
  }
}
