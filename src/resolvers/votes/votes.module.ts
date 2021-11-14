import { Module } from '@nestjs/common';
import { VotesService } from 'src/services/votes.service';
import { VotesResolver } from './votes.resolver';

@Module({
  imports: [],
  providers: [VotesResolver, VotesService],
})
export class VotesModule {}
