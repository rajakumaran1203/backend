// import { Injectable } from '@nestjs/common';
// import { inspect } from 'util';
// import * as Imap from 'node-imap';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { EmailCount } from './email-count.model';

// @Injectable()
// export class EmailInboxService {
//   private imap: any;

//   constructor(@InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>) {
//     this.imap = new Imap({
//       user: 'rajakumarandevloper@gmail.com',
//       password: 'grmwpcokgoqgamht',
//       host: 'imap.gmail.com',
//       port: 993,
//       tls: true,
//     });
//   }

//   public async fetchEmails(): Promise<{ emails: any[]; totalMessages: number, failureCount: number }> {
//     return new Promise<{ emails: any[]; totalMessages: number, failureCount: number }>((resolve, reject) => {
//       const emails: any[] = [];
//       let failureCount = 0;

//       this.imap.once('ready', () => {
//         this.openInbox((err, box) => {
//           if (err) {
//             reject(err);
//           } else {
//             const totalMessages = box.messages.total;
//             const f = this.imap.seq.fetch('1:*', {
//               bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
//               struct: true,
//             });

//             f.on('message', (msg, seqno) => {
//               const prefix = '(#' + seqno + ') ';
//               const email: any = {};
//               msg.on('body', (stream, info) => {
//                 let buffer = '';
//                 stream.on('data', (chunk) => {
//                   buffer += chunk.toString('utf8');
//                 });
//                 stream.once('end', () => {
//                   const headers = Imap.parseHeader(buffer);
//                   const fromAddress = headers['from'] && headers['from'].length > 0 ? headers['from'][0] : '';
//                   email.sender = fromAddress;
//                   email.header = inspect(headers);

//                   const subjectArray = headers.subject || [];
//                   const subjectString = subjectArray.join(', ');
//                   const isFailure = subjectString.toLowerCase().includes('failure');
//                   if (isFailure) {
//                     failureCount++;
//                   }
//                 });
//               });

//               msg.once('attributes', (attrs) => {
//                 email.attributes = attrs;
//               });

//               msg.once('end', () => {
//                 emails.push(email);
//               });
//             });

//             f.once('error', (fetchErr) => {
//               reject(fetchErr);
//             });

//             f.once('end', () => {
//               this.imap.end();
//               this.updateEmailStats('rajakumarandevloper@gmail.com', totalMessages, failureCount);
//               resolve({ emails, totalMessages, failureCount });
//             });
//           }
//         });
//       });

//       this.imap.once('error', (err) => {
//         reject(err);
//       });

//       this.imap.once('end', () => {
//         console.log('Connection ended');
//       });

//       this.imap.connect();
//     });
//   }

//   private openInbox(cb: (err: any, box: any) => void): void {
//     this.imap.openBox('INBOX', true, cb);
//   }
//   private async updateEmailStats(emailAddress: string, totalMessages: number, failureCount: number): Promise<void> {
//     let emailCount = await this.emailCountModel.findOne({ emailAddress }).exec();

//     if (!emailCount) {
//       emailCount = new this.emailCountModel({ emailAddress, totalMessages, failureCount });
//     } else {
//       emailCount.emailSent = totalMessages;
//       emailCount.warmupEmailSent = failureCount;
//     }

//     await emailCount.save();
//   } 
//   async getAllEmailDetails(): Promise<EmailCount[]> {
//     return this.emailCountModel.find().exec();
//   }
// }

import { Injectable } from '@nestjs/common';
import { inspect } from 'util';
import * as Imap from 'node-imap';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailCount } from './email-count.model';
import { EmailCredentials } from './user_details';

@Injectable()
export class EmailInboxService {
  private imap: any;

  constructor(@InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>,
  @InjectModel(EmailCredentials.name) private readonly emailCredentialsModel: Model<EmailCredentials>) {
    this.imap = new Imap({});
  }
  async create(email: string, password: string): Promise<EmailCredentials> {
    const createdEmailCredentials = new this.emailCredentialsModel({ user: email, password });
    return createdEmailCredentials.save();
  }

  private async getEmailCredentials(): Promise<{ user: string; password: string } | null> {
    const credentials = await this.emailCredentialsModel.findOne().exec();
    return credentials ? { user: credentials.user, password: credentials.password } : null;
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
      // Handle errors appropriately
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

              // Count flags when they are non-empty strings
              let nonEmptyFlagsCount = 0;

              emails.forEach((email) => {
                if (email.attributes.flags && email.attributes.flags.length > 0) {
                  email.attributes.flags.forEach((flag) => {
                    // Check if the flag is a non-empty string
                    if (typeof flag === 'string' && flag.trim() !== '') {
                      nonEmptyFlagsCount++;
                    }
                  });
                }
              });

              console.log('Empty Flags Count:', emptyFlagsCount);
              console.log('Non-Empty Flags Count:', nonEmptyFlagsCount);
              // const emailAddress = credentials.user
              const emailAddress = credentials.user;
              this.updateEmailStats(emailAddress, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount);
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
}