import { EmailService } from "./email.service";
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    getAllTemplates(): Promise<import("./email.schema").Email[]>;
    sendEmail(formData: any): Promise<"successfully sent !" | {
        success: boolean;
        message: string;
    }>;
}
