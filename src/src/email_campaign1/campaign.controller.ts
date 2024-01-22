// campaign.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignDto } from './campaign.dto';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post('create')
  async createCampaign(@Body() campaignDto: CampaignDto) {
    return this.campaignService.createCampaign(campaignDto);
  }

  @Get()
  async getAllCampaigns() {
    return this.campaignService.getAllCampaigns();
  }

  @Get(':id')
  async getCampaignById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }
}
