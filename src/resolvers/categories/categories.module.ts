import { Module } from '@nestjs/common';
import { CategoriesService } from 'src/services/categories.service';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [],
  providers: [CategoriesResolver, CategoriesService],
})
export class CategoriesModule {}
