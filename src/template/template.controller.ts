import { Controller, Get, Param } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async getAllTemplates() {
    const templates = await this.templateService.findAll();
    return templates;
  }
}