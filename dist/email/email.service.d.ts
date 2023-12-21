import { Model } from 'mongoose';
import { Email } from './email.schema';
import { User } from './user.model';
export declare class EmailService {
    private readonly emailModel;
    private readonly userModel;
    private transporter;
    constructor(emailModel: Model<Email>, userModel: Model<User>);
    sendEmail(to: string[], subject: string, text: string): Promise<void>;
    findAll(): Promise<Email[]>;
    getEmails(): Promise<{
        value: string;
        label: string;
    }[]>;
}
