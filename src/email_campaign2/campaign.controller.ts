import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.schema';

@Controller('testemailcampaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get(':id')
  async getMainStructureById(@Param('id') id: string): Promise<Campaign> {
    return this.campaignService.getMainStructureById(id);
  }

  @Post('create')
  async createMainStructure(@Body() mainStructure: Campaign): Promise<Campaign> {
    const createdCampaign = await this.campaignService.createMainStructure(mainStructure);
    await this.getAllCampaigns(); 
    return createdCampaign;
  }

  @Patch(':id')
  async updateMainStructure(@Param('id') id: string, @Body() mainStructure: Campaign): Promise<Campaign> {
    return this.campaignService.updateMainStructure(id, mainStructure);
  }

  @Delete(':id')
  async deleteMainStructure(@Param('id') id: string): Promise<void> {
    return this.campaignService.deleteMainStructure(id);
  }

  @Get()
   async getAllCampaigns(): Promise<Campaign[]> {
     return this.campaignService.getAllCampaigns();
}

}
