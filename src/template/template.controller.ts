import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
 
  @Get()
  async getAllTemplates() {
    const templates = await this.templateService.findAll();
    return templates;
  }
  
  @Post('create')
  async createTemplate(@Body() templateData: { name: string; subject: string; description: string }) {
    const createdTemplate = await this.templateService.create(templateData);
    return createdTemplate;
  }
}

