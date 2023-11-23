import { Model } from 'mongoose';
import { Template } from './template.schema';
export declare class TemplateService {
    private readonly templateModel;
    constructor(templateModel: Model<Template>);
    findAll(): Promise<Template[]>;
    create(templateData: {
        name: string;
        subject: string;
        description: string;
    }): Promise<Template>;
}
