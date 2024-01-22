import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController,EmailListController } from './email.controller';
import { EmailService } from './email.service';
import { EmailSchema } from './email.schema';
import { UserModel } from './user.model';
import { CsvRecord, CsvRecordSchema } from '../upload_file/csv-record.schema';
import {EmailCredentials, EmailCredentialsSchema} from '../email_inbox/user_details';
import { ScheduleModule } from '@nestjs/schedule';
import { Campaign, CampaignSchema } from '../email_campaign1/campaign.schema';
import { CronModel, CronModelSchema } from './cron.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }]),
  MongooseModule.forFeature([{ name: CsvRecord.name, schema: CsvRecordSchema }]),
  MongooseModule.forFeature([{ name: 'EmailCredentials', schema: EmailCredentialsSchema }]),
  ScheduleModule.forRoot(),
  MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
  MongooseModule.forFeature([{ name: 'CronModel', schema: CronModelSchema }]),
  MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),],
  controllers: [EmailController,EmailListController],
  providers: [EmailService],
})
export class EmailModule {}


