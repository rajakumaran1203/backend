import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateSchema } from './template.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }])],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}


