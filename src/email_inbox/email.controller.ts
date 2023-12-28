// import { Controller, Get } from '@nestjs/common';
// import { EmailInboxService } from './email.service';

// @Controller('emails')
// export class EmailController {
//   constructor(private readonly emailService: EmailInboxService) {}

//   @Get('fetch')
//   async fetchEmails(): Promise<string> {
//     try {
//       await this.emailService.fetchEmails();
//       return 'Emails fetched successfully';
//     } catch (error) {
//       return `Error fetching emails: ${error.message}`;
//     }
//   }
// }

// import { Controller, Get } from '@nestjs/common';
// import { EmailInboxService } from './email.service';

// @Controller('emails')
// export class EmailController {
//   constructor(private readonly emailService: EmailInboxService) {}

//   @Get('fetch')
//   async fetchEmails(): Promise<any[]> {
//     try {
//       const emails = await this.emailService.fetchEmails();
//       return emails;
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//       throw error; // Optionally, you can throw the error to let NestJS handle it globally.
//     }
//   }
// }

// import { Controller, Get } from '@nestjs/common';
// import { EmailInboxService } from './email.service'; // Adjust the import path based on your project structure

// @Controller('emails-inbox')
// export class EmailInboxController {
//   constructor(private readonly emailInboxService: EmailInboxService) {}

//   @Get('fetch')
//   async fetchEmails(): Promise<any[]> {
//     try {
//       const emails = await this.emailInboxService.fetchEmails();
//       return emails;
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//       throw error; // Optionally, you can throw the error to let NestJS handle it globally.
//     }
//   }

//   @Get('stats')
//   getStats(): { successCount: number; failureCount: number } {
//     const { successCount, failureCount } = this.emailInboxService.getStats();
//     return { successCount, failureCount };
//   }
// }


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
