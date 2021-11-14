import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from 'src/resolvers/categories/dto/create.category.input';
import { UpdateCategoryInput } from 'src/resolvers/categories/dto/update.category.input';
import { Categories } from '.prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    category: CreateCategoryInput & { userId: string }
  ): Promise<Categories> {
    const categoryCreated = this.prisma.categories.create({
      data: {
        ...category,
        name: category.name.toLowerCase(),
      },
    });
    return categoryCreated;
  }

  async updateCategory(category: UpdateCategoryInput): Promise<Categories> {
    const categoryUpdated = this.prisma.categories.update({
      where: { id: category.id },
      data: {
        ...category,
        name: category.name.toLowerCase(),
      },
    });
    return categoryUpdated;
  }

  async deleteCategory(categoryId: string): Promise<Categories> {
    const deletedCategory = this.prisma.categories.update({
      where: {
        id: categoryId,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
    return deletedCategory;
  }

  async fetchOneCategory(categoryId: string): Promise<Categories> {
    const category = this.prisma.categories.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
      include: {
        user: true,
        views: true,
        posts: true,
      },
    });
    return category;
  }

  async fetchCategories(): Promise<Categories[]> {
    const categories = this.prisma.categories.findMany({
      include: {
        user: true,
        views: true,
        posts: true,
      },
    });
    return categories;
  }
}
