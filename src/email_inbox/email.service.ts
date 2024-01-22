import { Injectable, NotFoundException  } from '@nestjs/common';
import { inspect } from 'util';
import * as Imap from 'node-imap';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailCount } from './email-count.model';
import { EmailCredentials } from './user_details';
import { promises } from 'dns';
import {EmailWarmUp} from './warmup.model';
import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { email_data } from './email-list.model';
// import * as cron from 'cron';
import * as cron from 'node-cron';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class EmailInboxService {
  private readonly logger = new Logger(EmailInboxService.name);
  private imap: any;
  public emailsdata: any[] = [];
  private transporter: nodemailer.Transporter;

  constructor(@InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>,
  @InjectModel(EmailCredentials.name) private readonly emailCredentialsModel: Model<EmailCredentials>,
  @InjectModel(EmailWarmUp.name) private readonly emailWarmpupModel: Model<EmailWarmUp>,
  @InjectModel(email_data.name) private readonly emailListModel: Model<email_data>) {
    this.imap = new Imap({});
  }
  async create(email: string, password: string): Promise<EmailCredentials> {
    const createdEmailCredentials = new this.emailCredentialsModel({ user: email, password });
    return createdEmailCredentials.save();
  }

  async deleteByEmail(email: string): Promise<void> {
    const result = await this.emailCredentialsModel.deleteOne({ user: email }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Email credentials with email '${email}' not found.`);
    }
  } 
  private async getEmailCredentials(): Promise<{ user: string; password: string } | null> {
    const credentials = await this.emailCredentialsModel.findOne().exec();
    return credentials ? { user: credentials.user, password: credentials.password } : null;
  }

  // private async getAllEmailCredentials(): Promise<{ user: string; password: string }[] | null> {
  //   const credentialsList = await this.emailCredentialsModel.find().exec();
  //   return credentialsList.map(credentials => ({
  //     user: credentials.user,
  //     password: credentials.password,
  //   }));
  // }
  async getAllEmailCredentials(): Promise<{ user: string;}[] | null> {
    const credentialsList = await this.emailCredentialsModel.find().exec();
    return credentialsList.map(credentials => ({
      user: credentials.user,
    }));
  }


  public async fetchEmails(): Promise<{ emails: any[]; totalMessages: number, failureCount: number, emptyFlagsCount: number, nonEmptyFlagsCount:number }> {
    const credentials = await this.getEmailCredentials();
    try {
      const credentials = await this.getEmailCredentials();
      if (!credentials) {
        throw new Error('Email credentials not found.');
      }
      this.imap = new Imap({
        user: credentials.user,
        password: credentials.password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
      });
 
    } catch (error) {
      throw error;
    }
    return new Promise<{ emails: any[]; totalMessages: number, failureCount: number, emptyFlagsCount:number, nonEmptyFlagsCount: number }>((resolve, reject) => {
      const emails: any[] = [];
      let failureCount = 0;

      this.imap.once('ready', () => {
        this.openInbox((err, box) => {
          if (err) {
            reject(err);
          } else {
            const totalMessages = box.messages.total;
            const f = this.imap.seq.fetch('1:*', {
              bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
              struct: true,
            });

            f.on('message', (msg, seqno) => {
              const prefix = '(#' + seqno + ') ';
              const email: any = {};
              msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  const headers = Imap.parseHeader(buffer);
                  const fromAddress = headers['from'] && headers['from'].length > 0 ? headers['from'][0] : '';
                  email.sender = fromAddress;
                  email.header = inspect(headers);

                  const subjectArray = headers.subject || [];
                  const subjectString = subjectArray.join(', ');
                  const isFailure = subjectString.toLowerCase().includes('failure');
                  
                  if (isFailure) {
                    failureCount++;
                  }
                });
              });

              msg.once('attributes', (attrs) => {
                email.attributes = attrs;
              });

              msg.once('end', () => {
                emails.push(email);
              });
            });

            f.once('error', (fetchErr) => {
              reject(fetchErr);
            });

            f.once('end', () => {
              this.imap.end();
              const emptyFlagsCount = emails.filter((email) => !email.attributes.flags || email.attributes.flags.length === 0).length;
              let nonEmptyFlagsCount = 0;

              emails.forEach((email) => {
                if (email.attributes.flags && email.attributes.flags.length > 0) {
                  email.attributes.flags.forEach((flag) => {
                    if (typeof flag === 'string' && flag.trim() !== '') {
                      nonEmptyFlagsCount++;
                    }
                  });
                }
              });

              const emailAddress = credentials.user;
              this.updateEmailStats(emailAddress, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount);
              this.emailsdata.push(emailAddress,totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount);
              resolve({ emails, totalMessages, failureCount, emptyFlagsCount,nonEmptyFlagsCount });
            });
          }
        });
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.once('end', () => {
        console.log('Connection ended');
      });
      this.imap.connect();
    });
  }

  private openInbox(cb: (err: any, box: any) => void): void {
    this.imap.openBox('INBOX', true, cb);
  }
  private async updateEmailStats(emailAddress: string, totalMessages: number, failureCount: number, emptyFlagsCount: number, nonEmptyFlagsCount:number): Promise<void> {
    let emailCount = await this.emailCountModel.findOne({ emailAddress }).exec();

    if (!emailCount) {
      emailCount = new this.emailCountModel({ emailAddress, totalMessages, failureCount,emptyFlagsCount,nonEmptyFlagsCount });
    } else {
      emailCount.emailSent = totalMessages;
      emailCount.warmupEmailSent = failureCount;
      emailCount.Seen = nonEmptyFlagsCount;
      emailCount.Unseen = emptyFlagsCount;
    }

    await emailCount.save();
  } 
  async getAllEmailDetails(): Promise<EmailCount[]> {
    return this.emailCountModel.find().exec();
  }


  async createwarmup(emailAddress: string, totalMessages: number, failureCount: number, nonEmptyFlagsCount: number, emptyFlagsCount: number, isWarmUpOn: boolean, totalWarmUpEmailsPerDay: number, dailyRampUpEnabled: boolean, rampUpIncrement: number,  handleCardSelection: string ): Promise<EmailWarmUp> {
    try {
      this.fetchEmails();
      const [emailAddress, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount] = this.emailsdata;
      this.logger.log(`Creating warmup for ${emailAddress}`);
      const emailWarmUp = new this.emailWarmpupModel({
      emailAddress,
      emailSent: totalMessages,
      warmupEmailSent: failureCount,
      Seen: nonEmptyFlagsCount,
      Unseen: emptyFlagsCount,
      isWarmUpOn,
      totalWarmUpEmailsPerDay,
      dailyRampUpEnabled,
      rampUpIncrement,
      handleCardSelection,
    });
    if (isWarmUpOn) {
      console.log("send Sucedss");
      await this.sendEmails(totalWarmUpEmailsPerDay); 
    }
    const result = await emailWarmUp.save();

    this.logger.log(`Warmup created successfully for ${emailAddress}`);
    return result;
  } catch (error) {
    this.logger.error(`Error creating warmup for ${emailAddress}: ${error.message}`);
    throw error;
  }
  }

  async getEmailList(): Promise<email_data[] | null> {
    try {
      const emailLists = await this.emailListModel.find().exec();
      return emailLists;
    } catch (error) {
      console.error('Error getting email list:', error.message);
      return null;
    }
  }

  @Cron('40 21 * * *') // Run at 7:45 PM every day
  async sendEmails(totalWarmUpEmailsPerDay: number): Promise<void> {
    try {
      const useremail: string[] = [];
      const emaillists = await this.getEmailList();
      emaillists.forEach((item) => {
        item.Emaillist.forEach((email) => {
          useremail.push(email);
        });
      });
  
      const credentials = await this.getEmailCredentials();
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: credentials.user,
          pass: credentials.password,
        },
      });
  
      for (const userEmail of useremail.slice(0, totalWarmUpEmailsPerDay)) {
        const mailOptions = {
          from: credentials.user,
          to: userEmail,
          subject: 'Welcome to Our Community',
          html: `<p>Hello ${userEmail},</p>
          <p>Welcome to our community! Your account is now active.</p>
          <p>Enjoy your time with us!</p>`,
        };
        console.log(userEmail,"mail isdddddd");
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log(`Email sent to ${userEmail}: ${info.response}`);
        } catch (error) {
          console.error(`Error sending email to ${userEmail}:`, error);
        }
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  }
  

}