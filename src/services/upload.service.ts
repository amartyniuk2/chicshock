import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { SignedURLResponse } from 'src/models/upload.model';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('BUCKET_NAME'),
        Body: dataBuffer,
        Key: filename,
      })
      .promise();
    return uploadResult;
  }

  async getPreSignedURL(filename: string): Promise<SignedURLResponse> {
    const s3 = new S3();
    const expiry = this.configService.get('SIGNED_URL_TIMEOUT')
      ? this.configService.get('SIGNED_URL_TIMEOUT')
      : 72000;
    const presignedPUTURL = s3.getSignedUrl('putObject', {
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: filename,
      Expires: expiry,
    });

    return {
      url: presignedPUTURL,
      durationToExpire: expiry,
    };
  }
}
