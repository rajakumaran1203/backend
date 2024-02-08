import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './campaign.schema';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import {EmailCredentials, EmailCredentialsSchema} from './user_details';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]),
    MongooseModule.forFeature([{ name: EmailCredentials.name, schema: EmailCredentialsSchema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule1 {}

