import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { EmailInboxService } from './email.service';
import {EmailCount} from './email-count.model';
import { Logger } from '@nestjs/common';
import { email_data } from './email-list.model';


@Controller('email')
export class EmailInboxController {
  private readonly logger = new Logger(EmailInboxService.name);
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
@Get('sender-email')
async getAllEmailCredentials() {
  const credentialsList = await this.emailService.getAllEmailCredentials();
  if (credentialsList && credentialsList.length > 0) {
    return { message: 'Credentials retrieved successfully', credentialsList };
  } else {
    return { message: 'No credentials found' };
  }
}

@Delete('delete/:email')
async deleteByEmail(@Param('email') email: string): Promise<void> {
  await this.emailService.deleteByEmail(email);
}
//http://localhost:3000/email/delete/arundaviddev@gmail.com
@Get('getemails')
async getEmails(): Promise<any> {
  try {
    const result = await this.emailService.fetchEmails();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
@Post("createwarmup")
async createWarmUp(@Body('emailAddress') emailAddress: string, @Body('emailSent')emailSent: number, @Body('warmupEmailSent') warmupEmailSent: number, @Body('Seen') Seen: number, @Body('Unseen') Unseen: number, @Body('isWarmUpOn') isWarmUpOn: boolean,@Body('totalWarmUpEmailsPerDay') totalWarmUpEmailsPerDay:number, @Body('dailyRampUpEnabled') dailyRampUpEnabled: boolean, @Body('rampUpIncrement') rampUpIncrement: number,  @Body('handleCardSelection') handleCardSelection: string){
  try {
    this.logger.log(`Creating warmup for ${emailAddress}`);
    const result = await this.emailService.createwarmup(emailAddress, emailSent, warmupEmailSent, Seen, Unseen, isWarmUpOn,totalWarmUpEmailsPerDay, dailyRampUpEnabled, rampUpIncrement, handleCardSelection);
    this.logger.log(`Warmup created successfully for ${emailAddress}`);
    return { success: true, data: result };
  } catch (error) {
    this.logger.error(`Error creating warmup for ${emailAddress}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

@Get('emailgetlist')
async getEmailListController(): Promise<email_data[] | null> {
  return this.emailService.getEmailList();
}

@Get('sendmails')
async sendEmails(totalWarmUpEmailsPerDay:number): Promise<void> {
  try {
    await this.emailService.sendEmails(totalWarmUpEmailsPerDay);
    // Respond with a success message or any necessary information
  } catch (error) {
    // Handle errors and respond accordingly
    console.error('Error sending emails:', error.message);
    // Respond with an error message or any necessary information
  }
}

}

