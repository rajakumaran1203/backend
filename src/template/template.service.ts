import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from './template.schema';


@Injectable()
export class TemplateService {
  constructor(@InjectModel('Template') private readonly templateModel: Model<Template>) {}

  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }

  async create(templateData: { name: string; subject: string; description: string }): Promise<Template> {
    const createdTemplate = new this.templateModel(templateData);
    return createdTemplate.save();
  }
}
