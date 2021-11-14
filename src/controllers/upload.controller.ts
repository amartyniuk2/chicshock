import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/services/upload.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res) {
    try {
      const mimeType = file.mimetype.split('/');
      if (file.size > Number(this.configService.get('FILE_IMAGE_SIZE'))) {
        return res.status(400).json({
          message: 'file is too large to be uploaded',
        });
      }

      if (mimeType[0] !== 'image') {
        return res.status(400).json({
          message: 'file should be an image',
        });
      }

      const fileKey = uuidv4();
      await this.uploadService.uploadPublicFile(file.buffer, fileKey);
      return res.status(201).json({
        fileUrl: `${this.configService.get('CLOUDFRONT_URL')}/${fileKey}`,
        message: `Successfully uploaded file ${file.originalname}`,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'failed to upload file',
      });
    }
  }
}
