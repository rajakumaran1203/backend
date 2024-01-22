import { EmailInboxService } from './email.service';
import { EmailCount } from './email-count.model';
export declare class EmailInboxController {
    private readonly emailService;
    constructor(emailService: EmailInboxService);
    fetchEmails(): Promise<{
        emails: any[];
        totalMessages: number;
        failureCount: number;
    }>;
    getAllEmailDetails(): Promise<EmailCount[]>;
    createEmailCredentials(email: string, password: string): Promise<{
        message: string;
        data: import("./user_details").EmailCredentials;
        error?: undefined;
    } | {
        error: any;
        message?: undefined;
        data?: undefined;
    }>;
}
