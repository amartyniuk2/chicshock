import { UploadService } from './../../services/upload.service';
import { Module } from '@nestjs/common';
import { UploadResolver } from './upload.resolver';

@Module({
  imports: [],
  providers: [UploadResolver, UploadService],
})
export class UploadModule {}
