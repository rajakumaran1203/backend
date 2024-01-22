// campaign.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './campaign.schema';
import { CampaignDto } from './campaign.dto';

@Injectable()
export class CampaignService {
  constructor(@InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>) {}

  async createCampaign(campaignDto: CampaignDto): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(campaignDto);
    return createdCampaign.save();
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return this.campaignModel.findById(id).exec();
  }
}
