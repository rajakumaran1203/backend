import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from './template.schema';
import axios from 'axios';

// @Injectable()
// export class TemplateService {
//   constructor(@InjectModel('Template') private readonly templateModel: Model<Template>) {}

//   async getTemplates(): Promise<Template[]> {
//     return this.templateModel.find().exec();
//   }
// }


// @Injectable()
// export class TemplateService {
//   constructor(@InjectModel('Template') private readonly templateModel: Model<Template>) {}

//   async getAllTemplates(): Promise<Template[]> {
//     return this.templateModel.find().exec();
//   }
// }



@Injectable()
export class TemplateService {
  constructor(@InjectModel('Template') private readonly templateModel: Model<Template>) {}

  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }
}


// @Injectable()
// export class TemplateService {
//   constructor(@InjectModel('Template') private readonly templateModel: Model<Template>) {}

//   async getTemplateById(id: string): Promise<Template | null> {
//     return this.templateModel.findById(id).exec();
//   }

//   async getAllTemplates(): Promise<Template[]> {
//     return this.templateModel.find().exec();
//   }
// }