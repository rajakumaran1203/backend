import { EmailService } from "./email.service";
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    getEmail(): any;
    sendEmail(formData: any): Promise<"successfully sent !" | {
        success: boolean;
        message: string;
    }>;
}
