import { Injectable, UploadedFile, UploadedFiles } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {

    async updateSignFile(@UploadedFile() file: Express.Multer.File) {
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        })
        const uuid = uuidv4()

        const rs = await s3.putObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uuid,
            Body: file.buffer,
            ContentType: file.originalname.split(".")[1]
        }).promise()
        return `https://doantotnghiepbucket.s3.amazonaws.com/${uuid}`

    }
}
