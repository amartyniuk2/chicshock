import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Reports } from '.prisma/client';
import { CreateReportInput } from 'src/resolvers/reports/dto/create.report.input';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(
    report: CreateReportInput,
    userId: string
  ): Promise<Reports> {
    const createdReport = this.prisma.reports.create({
      data: {
        ...report,
        userId,
      },
      // TODO: make it deeper ?
      include: {
        user: true,
        post: true,
      },
    });
    return createdReport;
  }

  async checkIfAlreadyReported(
    postId: string,
    userId: string
  ): Promise<Reports> {
    const report = this.prisma.reports.findFirst({
      where: {
        postId,
        userId,
      },
    });
    return report;
  }

  async isRemovePost(postId: string): Promise<boolean> {
    const count = await this.prisma.reports.count({ where: { postId } });
    const { allowedReportsCountPerPost } =
      await this.prisma.appConfigs.findFirst();
    return count > allowedReportsCountPerPost;
  }

  async isBanUser(userId: string): Promise<boolean> {
    const { allowedReportsCountPerPost, countOfBlockedPostsBeforeBan } =
      await this.prisma.appConfigs.findFirst();
    const query = `
        SELECT * FROM "Posts" p
          WHERE
            p."userId" = '${userId}' and
            (SELECT count(*) FROM "Reports" r where r."postId" = p.id) > ${allowedReportsCountPerPost}
        ;
      `;
    const posts = await this.prisma.$queryRaw(query);

    if (posts.length === countOfBlockedPostsBeforeBan) {
      console.log('SEND WARNING TO USER');
      // TODO: send email / push notification
    }

    if (posts.length > countOfBlockedPostsBeforeBan) {
      return true;
    }
    return false;
  }

  async getReports(opt: { postId: string }): Promise<Reports[]> {
    return this.prisma.reports.findMany({ where: { ...opt } });
  }
}
