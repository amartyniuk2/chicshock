import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../../decorators/user.decorator';
import { User } from '../../models/user.model';
import { CategoriesService } from 'src/services/categories.service';
import { CreateCategoryInput } from './dto/create.category.input';
import { UpdateCategoryInput } from './dto/update.category.input';
import { Categories } from 'src/models/categories.model';
import { handleError } from 'src/common/exceptions/exceptions';

@Resolver(() => Categories)
@UseGuards(GqlAuthGuard)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => [Categories])
  async fetchCategories() {
    try {
      const categories = await this.categoriesService.fetchCategories();
      return categories;
    } catch (error) {
      handleError(error, 'failed to categories');
    }
  }

  @Query(() => Categories)
  async fetchCategory(@Args('categoryId') categoryId: string) {
    try {
      const category = await this.categoriesService.fetchOneCategory(
        categoryId
      );
      return category;
    } catch (error) {
      handleError(error, 'failed to fetch category');
    }
  }

  @Mutation(() => Categories)
  async createCategory(
    @UserEntity() user: User,
    @Args('data') data: CreateCategoryInput
  ) {
    try {
      const category = await this.categoriesService.createCategory({
        ...data,
        userId: user.id,
      });
      return category;
    } catch (error) {
      handleError(error, 'failed to create category');
    }
  }

  @Mutation(() => Categories)
  async updateCategory(@Args('data') data: UpdateCategoryInput) {
    try {
      const category = await this.categoriesService.updateCategory(data);
      return category;
    } catch (error) {
      handleError(error, 'failed to update category');
    }
  }

  @Mutation(() => Categories)
  async deleteCategory(@Args('categoryId') categoryId: string) {
    try {
      const category = await this.categoriesService.deleteCategory(categoryId);
      return category;
    } catch (error) {
      handleError(error, 'failed to delete category');
    }
  }
}
