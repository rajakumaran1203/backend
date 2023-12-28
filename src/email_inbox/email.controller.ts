import { Controller, Get, Param } from '@nestjs/common';
import { EmailInboxService } from './email.service';
import {EmailCount} from './email-count.model';


@Controller('email')
export class EmailInboxController {
  constructor(private readonly emailService: EmailInboxService) {}

@Get('fetch-emails')
async fetchEmails(): Promise<{ emails: any[]; totalMessages: number, failureCount: number }> {
  return this.emailService.fetchEmails();
}
@Get('details')
async getAllEmailDetails(): Promise<EmailCount[]> {
  try {
    return await this.emailService.getAllEmailDetails();
  } catch (error) {
    throw error;
  }
}
}
