import { handleError } from './../../common/exceptions/exceptions';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UploadService } from 'src/services/upload.service';
import { SignedURLResponse } from 'src/models/upload.model';

@Resolver(() => SignedURLResponse)
@UseGuards(GqlAuthGuard)
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Query(() => SignedURLResponse)
  async fetchPresignedURL(@Args('filename') filename: string) {
    try {
      const presignedMetadata = await this.uploadService.getPreSignedURL(
        filename
      );
      return presignedMetadata;
    } catch (error) {
      handleError(error, 'failed to fetch pre signed url');
    }
  }
}
