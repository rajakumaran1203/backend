import { TemplateService } from './template.service';
export declare class TemplateController {
    private readonly templateService;
    constructor(templateService: TemplateService);
    getAllTemplates(): Promise<import("./template.schema").Template[]>;
    createTemplate(templateData: {
        name: string;
        subject: string;
        description: string;
    }): Promise<import("./template.schema").Template>;
}
