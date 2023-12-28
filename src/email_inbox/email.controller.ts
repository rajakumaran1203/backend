import { Controller, Get, Param, Post, Body } from '@nestjs/common';
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
@Post("add-user")
async createEmailCredentials(@Body('email') email: string, @Body('password') password: string) {
  try {
    const createdEmailCredentials = await this.emailService.create(email, password);
    return { message: 'Email credentials created successfully', data: createdEmailCredentials };
  } catch (error) {
    return { error: error.message };
  }
}
}
