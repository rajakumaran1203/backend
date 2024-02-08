// import { Injectable } from '@nestjs/common';
// import { MailerService } from './mailer.service';
// import * as schedule from 'node-schedule';
// import { CampaignService } from './campaign.service';

// @Injectable()
// export class SchedulerService {
//   constructor(private readonly mailerService: MailerService,
//     private readonly campaignDataService: CampaignService,) {}

//   scheduleEmail() {
//     const campaigns = this.campaignDataService.getAllCampaigns(); 
//     const scheduler = campaigns[0].scheduler;
//     const rampUpCount = campaigns[0].scheduler.rampUpCount;
//     console.log(campaigns,scheduler,"klklk"); 
//     const leads = campaigns[0].leads;
//     const subject = campaigns[0].template.emails.subject;
//     const description = campaigns[0].template.emails.description;
//     const senderIds = campaigns[0].scheduler.senderIds.selectedSenders;


//     const startTimeParts = scheduler.startTime.split(':');
//     const endTimeParts = scheduler.endTime.split(':');
//     const startHour = parseInt(startTimeParts[0], 10);
//     const startMinute = parseInt(startTimeParts[1], 10);
//     const endHour = parseInt(endTimeParts.split(':')[0]);
//     const endMinute = parseInt(endTimeParts.split(':')[1]);

//     const scheduledDate = new Date();
//     scheduledDate.setHours(startHour, startMinute, 0, 0); 

//     const rule = new schedule.RecurrenceRule();
//     rule.hour = { start: startHour, end: endHour, step: rampUpCount };
//     rule.minute = startMinute;
    

//     for (const lead of leads) {
//       console.log(`Name: ${lead.name}, Email: ${lead.email}`);
    

//     schedule.scheduleJob(rule, async () => {
//       // Task to be executed at the scheduled time
//       try {
//         await this.mailerService.sendMail(lead.email, subject, description);
//         console.log('Email sent successfully!');
//       } catch (error) {
//         console.error('Error sending email:', error);
//       }
//     });
//   }
//   }
// }



import { Injectable } from '@nestjs/common';
import { MailerService } from './mailer.service';
import * as schedule from 'node-schedule';
import { CampaignService } from './campaign.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly campaignDataService: CampaignService,
  ) {}

  scheduleEmail() {
    const campaigns = this.campaignDataService.getAllCampaigns();
    const scheduler = campaigns[0].scheduler;
    const rampUpCount = parseInt(scheduler.rampUpCount, 10);
    console.log(campaigns, scheduler, "klklk");
    const leads = campaigns[0].leads;
    const subject = campaigns[0].template.emails.subject;
    const description = campaigns[0].template.emails.description;

    const startTimeParts = scheduler.startTime.split(':');
    const startHour = parseInt(startTimeParts[0], 10);
    const startMinute = parseInt(startTimeParts[1], 10);

    const scheduledDate = new Date(); // Set the desired date and time
    scheduledDate.setHours(startHour, startMinute, 0, 0);

    const rule = new schedule.RecurrenceRule();
    rule.hour = { start: startHour, end: 23, step: rampUpCount };
    rule.minute = startMinute;

    const job = schedule.scheduleJob(scheduledDate, () => {
      for (const lead of leads) {
        console.log(`Name: ${lead.name}, Email: ${lead.email}`);

        // Task to be executed at the scheduled time
        this.mailerService.sendMail(lead.email, subject, description)
          .then(() => console.log('Email sent successfully!'))
          .catch(error => console.error('Error sending email:', error));
      }
    });

    console.log(`Job scheduled at: ${scheduledDate}`);
  }
}
