import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email } from './email.schema';
import { User } from './user.model';
import { CsvRecordDto } from '../upload_file/dto/csv-record.dto';
import { EmailCredentials } from '../email_inbox/user_details';
import { Cron } from '@nestjs/schedule';
import {CronModelDocument} from './cron.model';
import * as schedule from 'node-schedule';
import { Campaign } from '../email_campaign1/campaign.schema';
import { CampaignDto } from '../email_campaign1/campaign.dto';


@Injectable()
export class EmailService {
  private transporters: nodemailer.Transporter[];
  private readonly logger = new Logger(EmailService.name);
  constructor(
    @InjectModel('Email') private readonly emailModel: Model<Email>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel('CsvRecord') private readonly csvRecordModel: Model<CsvRecordDto>,
    @InjectModel(EmailCredentials.name) private readonly emailCredentialsModel: Model<EmailCredentials>,
    @InjectModel('CronModel') private readonly cronModel: Model<CronModelDocument>,
    @InjectModel(Campaign.name) private readonly CampaignModel: Model<Campaign>,
  ) {
    this.setupTransporters();
  }

  private async setupTransporters(): Promise<void> {
    const allCredentials = await this.getAllEmailCredentials();

    if (allCredentials.length > 0) {
      // Create an array to store multiple transporter instances
      this.transporters = allCredentials.map(credentials => {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: credentials.user,
            pass: credentials.password,
          },
        });
      });
    } else {
      // Handle the case where no email credentials are found
      this.logger.error('No email credentials found.');
    }
  }

  private async getAllEmailCredentials(): Promise<{ user: string; password: string }[]> {
    const credentialsList = await this.emailCredentialsModel.find().exec();
    return credentialsList.map(credentials => ({
      user: credentials.user,
      password: credentials.password,
    }));
  }

  // @Cron('0 34 17 * * *') // Cron expression for running every day at 05:34 PM
  // async sendScheduledEmail(): Promise<void> {
  //   this.logger.log('Scheduled email sending started.');

  //   // Adjust subject and text as needed
  //   const subject = 'Your scheduled email subject';
  //   const text = 'Your scheduled email body text';

  //   await this.sendEmail(subject, text);

  //   this.logger.log('Scheduled email sending completed.');
  // }

 
  async findAll(): Promise<Email[]> {
    return this.emailModel.find().exec();
  }

  async getEmails(): Promise<{ value: string; label: string }[]> {
    const users = await this.userModel.find({}, 'email').exec();
    const emails = users.map(user => user.email);
    return emails.map(email => ({ value: email, label: email }));
  }

  async createCronSchedule(data: {startTime: string;  endTime: string;  rampUpCount: number;  senderIds: { selectedSenders: string[] }; }): Promise<void> {
    // Extract selected senders
    const selectedSenders = data.senderIds.selectedSenders;
     const campaign = await this.CampaignModel.find().sort({ _id: -1 }).exec();
    const campaignid = campaign[0]._id;
    // Create a new instance of CronModel
    const cronModel = new this.cronModel({
      startTime: data.startTime,
      endTime: data.endTime,
      rampUpCount: data.rampUpCount,
      isActive: true, 
      campaignId: campaignid,
      senderIds: selectedSenders,
    });

    // Save the instance to the database
    const savedCronJob = await cronModel.save();

    await this.scheduleRampUpAndSendEmails(savedCronJob._id.toString());
  }

async scheduleRampUpAndSendEmails(cronJobId: string): Promise<void> {
  const csvRecords = await this.csvRecordModel.find({ isActive: true }).exec();

  const record = csvRecords[0];
  const name = record.name;

  const cronJob = await this.cronModel.findById(cronJobId);
  console.log(cronJob);
  
  const senderIds = cronJob.senderIds;
  // console.log(senderIds,"444");
  // for (const senderId of senderIds) {
   
  if (cronJob.isActive = false) {
    console.log("Campaign are already Completed");
  }
  else {
  const campaignid = cronJob.campaignId;
  const campaigndata = await this.CampaignModel.aggregate([
    { $match: { _id: campaignid } },
    { $unwind: '$emails' },
    { $limit: 1 },
    { $project: { _id: 0, subject: '$emails.subject', description: '$emails.description' } },
  ]);

  if (!cronJob) {
    throw new Error('Cron job not found');
  }
  let emailInterval: NodeJS.Timeout;
  const { startTime, endTime, rampUpCount } = cronJob;
  const startHour = parseInt(startTime.split(':')[0]);
  const startMinute = parseInt(startTime.split(':')[1]);
  const endHour = parseInt(endTime.split(':')[0]);
  const endMinute = parseInt(endTime.split(':')[1]);

  const intervalMinutes = Math.floor((endMinute - startMinute) / rampUpCount);

  let emailCounter = 0;

  // Function to send email
  const sendEmailFunction = async () => {
    const jobTime = new Date();
    jobTime.setHours(startHour, startMinute + emailCounter * intervalMinutes, 0, 0);

    console.log(`Sending email at: ${jobTime}`);
    // const subject =`Welcome to Our Community ${name}`;
    const subject = campaigndata[0].subject;
    const description = campaigndata[0].description;
    await this.sendEmail(subject, description, senderIds);

    emailCounter++;

    // Check if all emails for the current interval have been sent
    if (emailCounter === rampUpCount) {
      console.log(`All emails sent for interval at: ${jobTime}`);
      await this.cronModel.findByIdAndUpdate(cronJobId, { isActive: false });
      // Reset the counter for the next interval
      emailCounter = 0;

      // Clear the interval once all emails are sent
      clearInterval(emailInterval);
    }
  };

  // Calculate the delay until the next start time
  const now = new Date();
  const startDateTime = new Date(now);
  startDateTime.setHours(startHour, startMinute, 0, 0);
  const delayUntilStart = startDateTime.getTime() - now.getTime();

  // Initial execution after the delay until the next start time
  setTimeout(() => {
    sendEmailFunction();
    // Set interval for subsequent executions
    const emailInterval = setInterval(sendEmailFunction, rampUpCount * 60 * 1000); 
    console.log(`Emails scheduled with rampUpCount  minutes interval`,emailInterval,rampUpCount);
  }, delayUntilStart);
}
}


  async sendEmail(subject: string, description: string, senderIds:string[]): Promise<void> {
    for (const senderId of senderIds) {
    const csvRecords = await this.csvRecordModel.find({ isActive: true }).exec();
    const record = csvRecords[0];
    const totalRecipients = csvRecords.length;

    if (totalRecipients === 0) {
      this.logger.error('No recipients found.');
      return;
    }

    let transporterIndex = 0;
    let emailsSentByAccount = 0;
    const transporter = this.transporters[transporterIndex];

      const mailOptions = {
        from: senderId,
        to: record.email,
        subject,
        text: description,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        this.logger.log(`Email sent to ${record.email}: ${info.messageId}`);
        const email = new this.emailModel({
          from: senderId,
          to: record.email,
          subject,
          description,
          sentAt: new Date(),
        });
        await email.save();
        await this.csvRecordModel.findByIdAndUpdate(record._id, { $set: { isActive: false } });
        emailsSentByAccount++;

                // If the current account has sent enough emails, switch to the next account
                if (emailsSentByAccount >= totalRecipients / this.transporters.length) {
                  transporterIndex = (transporterIndex + 1) % this.transporters.length;
                  emailsSentByAccount = 0;
                }
      } catch (error) {
        this.logger.error(`Error sending email to ${record.email}:`, error);
      }
    }
  
  }

  }

