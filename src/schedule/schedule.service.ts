// // schedule.service.ts
// import { Injectable } from '@nestjs/common';
// import * as cron from 'node-cron';
// import { EmailService } from './email.service';

// @Injectable()
// export class ScheduleService {
//   constructor(private readonly emailService: EmailService) {}

//   scheduleEmailTask() {
//     cron.schedule('0 0 * * *', () => {
//       this.emailService.sendEmail();
//     });
//   }
// }
