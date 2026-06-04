/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ImageUploaderService } from './image-uploader.service';

@Controller('image-uploader')
export class ImageUploaderController {

    constructor(private readonly imageUploaderService: ImageUploaderService) {}

    @Post('presigned-url')
    async getPresignedUrl(@Body() body): Promise<{presignedUrl: string, imageUrl: string} | string> {
        return this.imageUploaderService.getPresignedUrl(body);
    }
}
