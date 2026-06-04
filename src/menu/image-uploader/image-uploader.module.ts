/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ImageUploaderController } from './image-uploader.controller';
import { ImageUploaderService } from './image-uploader.service';

@Module({
  controllers: [ImageUploaderController],
  providers:[ImageUploaderService],
  exports:[ImageUploaderService]
})
export class ImageUploaderModule {}
