import { Model } from 'mongoose';
import { Email } from './email.schema';
export declare class EmailService {
    private readonly emailModel;
    private transporter;
    constructor(emailModel: Model<Email>);
    sendEmail(to: string, subject: string, text: string): Promise<void>;
}
