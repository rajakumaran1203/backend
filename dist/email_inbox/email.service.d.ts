import { Model } from 'mongoose';
import { EmailCount } from './email-count.model';
import { EmailCredentials } from './user_details';
export declare class EmailInboxService {
    private readonly emailCountModel;
    private readonly emailCredentialsModel;
    private imap;
    constructor(emailCountModel: Model<EmailCount>, emailCredentialsModel: Model<EmailCredentials>);
    create(email: string, password: string): Promise<EmailCredentials>;
    private getEmailCredentials;
    fetchEmails(): Promise<{
        emails: any[];
        totalMessages: number;
        failureCount: number;
        emptyFlagsCount: number;
        nonEmptyFlagsCount: number;
    }>;
    private openInbox;
    private updateEmailStats;
    getAllEmailDetails(): Promise<EmailCount[]>;
}
