/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */


import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';


@Injectable()
export class ImageUploaderService {

    private s3: S3Client;

    constructor(private configService: ConfigService) {
         this.s3 = new S3Client({
        region: this.configService.get<string>('AWS_REGION')!,
        credentials: {
            accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
            secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
        },
    });
    }


    //s3 presigned url
    async getPresignedUrl(body): Promise<{presignedUrl: string, imageUrl: string} | string> {
        const{ fileName } = body;
        const bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;
        const command = new PutObjectCommand({Bucket: bucketName , Key: fileName});
        try{
            const url = await getSignedUrl(this.s3, command, {expiresIn: 3600});
            return {presignedUrl: url, imageUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}`}; 
        }catch(error) {
           return error.message;
        }
    }

    
    async uploadFileToS3(@UploadedFile() file: Express.Multer.File){
        try {
            if(!file) {
            throw new Error('File is missing');
        }

        const key = `${Date.now()}-${file.originalname}`;
        
        const command =  new PutObjectCommand({
                            Bucket: this.configService.get<string>('S3_BUCKET_NAME')!,
                            Key: key,
                            Body: file.buffer,
                            ContentType: file.mimetype})

        await this.s3.send(command);

        const location = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        // Logic to upload file to S3 would go here
        return location;
        
        } catch (error) {
            throw new Error(error.message);
        }
    } 

}
